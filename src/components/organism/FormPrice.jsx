import { useLoadingStore } from "../../store/loadingStore";
import { usePriceStore } from "../../store/priceStore";
import { useTokenStore } from "../../store/tokenStore";
import { beautyDate, delay } from "../../helper";
import { toast } from "react-toastify";
import * as XLSX from "xlsx/xlsx.mjs";
import FileInput from "../atom/FileInput";
import ButtonSubmit from "../atom/ButtonSubmit";
import { symbols } from "../../helper/symbol";
import { generateLogPrice } from "../../api/apiService";

function FormPrice() {
  const isLoading = useLoadingStore((state) => state.isLoading);
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);
  const data = usePriceStore((state) => state.price);
  const setData = usePriceStore((state) => state.setPrice);
  const token = useTokenStore((state) => state.token);

  const handleFileChange = (event) => {
    setIsLoading(true);
    const file = event.target.files[0];
    const reader = new FileReader();
    const regexDay = /^(0[1-9]|[12][0-9]|3[01])$/;
    const toastLoading = toast.loading(`Uploading file excel`);

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      const sheetCount = workbook.SheetNames.length;
      let dataProduct = [];

      for (let i = 0; i < sheetCount; i++) {
        const sheetName = workbook.SheetNames[i];

        const checkSymbol = symbols.find((val) => val.value === sheetName);

        if (!checkSymbol) {
          toast.update(toastLoading, {
            render: `Cannot upload Symbol ${sheetName}, please check sheetname`,
            type: "error",
            isLoading: false,
            closeOnClick: true,
          });
          return;
        }

        const sheetData = workbook.Sheets[sheetName];
        let jsonData = XLSX.utils.sheet_to_json(sheetData, { header: 1 });

        jsonData.shift();
        jsonData.splice(-3);

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

        dataProduct.push({ symbol: sheetName, jsonData });
      }

      setData(dataProduct);
      console.log(dataProduct);
      setIsLoading(false);
      toast.update(toastLoading, {
        render: "Excel file uploaded successfully and ready for processing.",
        type: "success",
        isLoading: false,
        autoClose: 10003,
        closeOnClick: true,
      });
    };

    reader.readAsBinaryString(file);
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
    let symbol;
    for (let i = 0; i < countProduct; i++) {
      setIsLoading(true);
      symbol = data[i].symbol;

      const totalData = data[i].jsonData.length;
      const itemPerRequest = 999;
      const countRequest = Math.ceil(totalData / itemPerRequest);
      const sortedData = data[i].jsonData.slice().reverse();
      let isSuccess = false;

      const toastLoading = toast.loading(
        `Process Logging ${data[i].jsonData.length} Price for Symbol ${symbol}`
      );

      let hprice = null;
      let lprice = null;

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
          };
          const { error, message, data } = await generateLogPrice(
            request,
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
              render: `Symbol ${symbol} Generating Price ${percentage}%`,
              type: "info",
            });
            await delay(500);
          }
        } catch (err) {
          toast.update(toastLoading, {
            render: err.code,
            type: "error",
            isLoading: false,
            closeOnClick: true,
          });
          setIsLoading(false);
          break;
        }
      }

      if (isSuccess) {
        toast.update(toastLoading, {
          render: `Success Log price ${symbol} to elastic`,
          type: "success",
          closeOnClick: true,
          isLoading: false,
        });
      }
    }
    setIsLoading(false);
    setData([]);
  };

  return (
    <div className="form">
      <div className="title">Generate Log Price</div>
      {data && data.length > 0 ? (
        <table style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Total data</th>
              <th>From</th>
              <th>To</th>
            </tr>
          </thead>
          <tbody>
            {data.map((val) => (
              <tr key={val.symbol}>
                <td>{val.symbol}</td>
                <td>{val.jsonData.length}</td>
                <td>{beautyDate(val.jsonData[val.jsonData.length - 1])}</td>
                <td>{beautyDate(val.jsonData[0])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <></>
      )}
      <div className="ic2">
        <FileInput onChange={handleFileChange} />
      </div>
      <ButtonSubmit onClick={handleSubmitPrice} disabled={isLoading}>
        {isLoading ? "Loading Data" : "Submit"}
      </ButtonSubmit>
    </div>
  );
}

export default FormPrice;
