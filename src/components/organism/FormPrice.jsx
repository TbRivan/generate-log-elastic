import { useRef } from "react";
import { useLoadingStore } from "../../store/loadingStore";
import { usePriceStore } from "../../store/priceStore";
import { useTokenStore } from "../../store/tokenStore";
import { beautyDate, delay } from "../../helper";
import { toast } from "react-toastify";
import * as XLSX from "xlsx/xlsx.mjs";
import FileInput from "../atom/FileInput";
import ButtonSubmit from "../atom/ButtonSubmit";
import { SYMBOLS } from "../../helper/symbol";
import { generateLogPrice } from "../../api/apiService";
import HelpTooltip from "../atom/HelpTooltip";
import { useEnvironmentStore } from "../../store/envStore";

const regexYear = /^(20[0-4][0-9]|2050)$/;
const regexDay = /^(0[1-9]|[12][0-9]|3[01])$/;

function FormPrice() {
  const { isLoading, setIsLoading } = useLoadingStore();
  const { data, setData, year, setYear } = usePriceStore();
  const { token } = useTokenStore();
  const { doubleEnv, apiURL, mode } = useEnvironmentStore();
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    try {
      setIsLoading(true);
      const file = event.target.files[0];
      const reader = new FileReader();
      const toastLoading = toast.loading(`Uploading file excel`);
      const fileName = file.name;
      const year = fileName.slice(0, 4);

      if (!regexYear.test(year)) {
        toast.update(toastLoading, {
          render: `Failed to upload excel file, valid format file YYYYMMDD example: 20240131`,
          type: "error",
          isLoading: false,
          closeOnClick: true,
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setYear(year);

      reader.onload = (event) => {
        try {
          const workbook = XLSX.read(event.target.result, { type: "binary" });
          const sheetCount = workbook.SheetNames.length;
          let dataProduct = [];

          for (let i = 0; i < sheetCount; i++) {
            const sheetName = workbook.SheetNames[i];
            let symbolProduct = "";

            let checkSymbol = false;
            for (const symbol of SYMBOLS) {
              if (sheetName.includes(symbol.value)) {
                symbolProduct = symbol.value;
                checkSymbol = true;
              }
            }

            if (!checkSymbol) {
              toast.update(toastLoading, {
                render: `Cannot upload Symbol ${sheetName}, please check sheetname`,
                type: "error",
                isLoading: false,
                closeOnClick: true,
              });
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
              return;
            }

            const sheetData = workbook.Sheets[sheetName];
            let jsonData = XLSX.utils.sheet_to_json(sheetData, { header: 1 });

            if (jsonData.length <= 1 || jsonData[0].length < 1) {
              toast.update(toastLoading, {
                render: `Failed upload file, please check sheet ${sheetName}`,
                type: "error",
                isLoading: false,
                closeOnClick: true,
              });
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
              return;
            }

            jsonData.shift();

            jsonData = jsonData.filter((row) => {
              if (row[0]) {
                const [date] = row[0].split(" ");
                const [day] = date.split("/");
                if (day.match(regexDay)) {
                  return true;
                } else {
                  return false;
                }
              }
            });

            dataProduct.push({
              symbol: symbolProduct,
              hprice: "",
              lprice: "",
              jsonData,
            });
          }

          const groupedData = {};

          dataProduct.forEach((item) => {
            if (!groupedData[item.symbol]) {
              groupedData[item.symbol] = {
                symbol: item.symbol,
                hprice: item.hprice,
                lprice: item.lprice,
                jsonData: [],
              };
            }

            for (const data of item.jsonData) {
              groupedData[item.symbol].jsonData.push(data);
            }
          });

          const result = Object.values(groupedData);

          setData(result);
          setIsLoading(false);
          toast.update(toastLoading, {
            render:
              "Excel file uploaded successfully and ready for processing.",
            type: "success",
            isLoading: false,
            autoClose: 10003,
            closeOnClick: true,
          });
        } catch (error) {
          toast.update(toastLoading, {
            render: `${error.message}, Please contact administrator`,
            type: "error",
            isLoading: false,
            closeOnClick: true,
          });
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          return;
        }
      };

      reader.readAsBinaryString(file);
    } catch (error) {
      toast.update(toastLoading, {
        render: `Failed upload excel file, please check the file`,
        type: "error",
        isLoading: false,
        closeOnClick: true,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }
  };

  const handleInputChange = (symbol, field, value) => {
    const updatedData = data.map((item) =>
      item.symbol === symbol ? { ...item, [field]: value } : item
    );
    setData(updatedData);
  };

  const handleSubmitPrice = async () => {
    if (!token) {
      toast.error("Token cannot be empty!");
      return;
    } else if (data.length <= 0) {
      toast.error("Data already logged, please select another file");
      return;
    }

    const countProduct = data.length;

    // Reusable function to process data for a given URL
    const processDataPrice = async (url, token, env) => {
      for (let i = 0; i < countProduct; i++) {
        setIsLoading(true);
        const symbol = data[i].symbol;

        const totalData = data[i].jsonData.length;
        const itemPerRequest = 999;
        const countRequest = Math.ceil(totalData / itemPerRequest);
        const sortedData = data[i].jsonData.slice().reverse();
        let isSuccess = false;

        const toastLoading = toast.loading(
          `[${env}] Process Logging ${data[i].jsonData.length} Price for Symbol ${symbol}`
        );

        let hprice = data[i].hprice !== "" ? data[i].hprice : null;
        let lprice = data[i].lprice !== "" ? data[i].lprice : null;

        for (let x = 0; x < countRequest; x++) {
          let start = x * itemPerRequest;

          if (x !== 0) {
            start = start - 1;
          }

          const end = (x + 1) * itemPerRequest;
          const dataRequest = sortedData.slice(start, end);

          try {
            const request = {
              symbol,
              priceData: dataRequest,
              hlprice: { hprice, lprice },
              year,
            };

            // Use the appropriate API function based on the URL
            const { error, message, data } = await generateLogPrice(
              request,
              url,
              token
            );

            if (error) {
              toast.update(toastLoading, {
                render: message,
                type: "error",
                isLoading: false,
                closeOnClick: true,
              });
              isSuccess = false;
              setIsLoading(false);
              break;
            } else {
              hprice = data.hprice;
              lprice = data.lprice;
              isSuccess = true;

              const percentage = Math.floor((x / countRequest) * 100);
              toast.update(toastLoading, {
                render: `[${env}] Symbol ${symbol} Generating Price ${percentage}%`,
                type: "info",
              });
              await delay(500);
            }
          } catch (err) {
            toast.update(toastLoading, {
              render: `[${env}] Failed import price, please contact administrator`,
              type: "error",
              isLoading: false,
              closeOnClick: true,
            });
            setIsLoading(false);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            break;
          }
        }

        if (isSuccess) {
          toast.update(toastLoading, {
            render: `[${env}] Success Log price ${symbol} to elastic`,
            type: "success",
            closeOnClick: true,
            isLoading: false,
          });
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      }
    };

    if (doubleEnv) {
      const splitApiUrl = apiURL.split("|");
      const splitEnvName = mode.split(" & ");

      await Promise.all(
        splitApiUrl.map((url, index) =>
          processDataPrice(url, token, splitEnvName[index])
        )
      );
    } else {
      await processDataPrice(apiURL, token, mode);
    }

    setIsLoading(false);
    setData([]);
  };

  return (
    <div className="form">
      <HelpTooltip>
        <p>
          1. Choose file price data with format excel obtained from `winquote`,
          after uploading file, wait to file to be loaded
        </p>
        <p>
          2. If loaded successfully table on form will appear, after that please
          check the value, date from and to within the file, to customize high
          and low price, fill up the input on the table, if the high and low set
          to empty, the value will get from the excel data
        </p>
        <p>
          3. If the format excel is not in accordance with the desired format,
          the popup message will appear, please check the file again
        </p>
        <p>
          4. When all the good things ready to generate, click submit button and
          wait until the web finish generate the log to elastic, after finish
          generate log price consider checking the price on menu `price-history`
          in `web admin`
        </p>
      </HelpTooltip>
      <div className="title">Generate Log Price</div>
      {data && data.length > 0 ? (
        <table style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th rowSpan="2">Symbol</th>
              <th rowSpan="2">Total data</th>
              <th colSpan="2" style={{ textAlign: "center" }}>
                Customize
              </th>
              <th rowSpan="2" style={{ textAlign: "center" }}>
                From
              </th>
              <th rowSpan="2" style={{ textAlign: "center" }}>
                To
              </th>
            </tr>
            <tr>
              <th>High Price</th>
              <th>Low Price</th>
            </tr>
          </thead>
          <tbody>
            {data.map((val) => (
              <tr key={val.symbol}>
                <td>{val.symbol}</td>
                <td>{val.jsonData.length}</td>
                <td>
                  <input
                    type="number"
                    value={val.hprice}
                    onChange={(e) =>
                      handleInputChange(val.symbol, "hprice", e.target.value)
                    }
                    style={{ width: "70px" }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={val.lprice}
                    onChange={(e) =>
                      handleInputChange(val.symbol, "lprice", e.target.value)
                    }
                    style={{ width: "70px" }}
                  />
                </td>
                <td>
                  {beautyDate(val.jsonData[val.jsonData.length - 1], year)}
                </td>
                <td>{beautyDate(val.jsonData[0], year)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <></>
      )}
      <div className="ic2">
        <FileInput refFile={fileInputRef} onChange={handleFileChange} />
      </div>
      <ButtonSubmit onClick={handleSubmitPrice} disabled={isLoading}>
        {isLoading ? "Loading Data" : "Submit"}
      </ButtonSubmit>
    </div>
  );
}

export default FormPrice;
