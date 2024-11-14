import React, { useState } from "react";
import * as XLSX from "xlsx/xlsx.mjs";
import axios from "axios";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

function ExcelUploader() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState("");
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [timeFrom, setTimeFrom] = useState("00:00:00");
  const [timeTo, setTimeTo] = useState("23:59:59");
  const [symbol, setSymbol] = useState("");

  const host = import.meta.env.VITE_API_HOST;
  const port = import.meta.env.VITE_API_PORT;
  let apiURL = `${host}:${port}`;
  const mode = import.meta.env.MODE;

  if (mode === "uat") {
    apiURL = `${host}`;
  }

  const symbols = [
    { value: "HKK", label: "HKK" },
    { value: "JPK", label: "JPK" },
    { value: "XUL", label: "XUL" },
    { value: "XAG", label: "XAG" },
    { value: "AUDUSD", label: "AUDUSD" },
    { value: "EURUSD", label: "EURUSD" },
    { value: "GBPUSD", label: "GBPUSD" },
    { value: "USDCHF", label: "USDCHF" },
    { value: "USDJPY", label: "USDJPY" },
  ];

  const openCloseSymbol = [
    { symbol: "HKK", open: "08:14", close: "02:05" },
    { symbol: "JPK", open: "06:30", close: "03:47" },
    { symbol: "XUL", open: "06:00", close: "03:34" },
    { symbol: "XAG", open: "06:00", close: "03:34" },
    { symbol: "AUDUSD", open: "07:00", close: "03:03" },
    { symbol: "EURUSD", open: "07:00", close: "03:03" },
    { symbol: "GBPUSD", open: "07:00", close: "03:03" },
    { symbol: "USDCHF", open: "07:00", close: "03:03" },
    { symbol: "USDJPY", open: "07:00", close: "03:03" },
  ];

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const formatDate = (date) => {
    const newDate = new Date(date);
    return `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(newDate.getDate()).padStart(2, "0")}`;
  };

  const handleFileChange = (event) => {
    setIsLoading(true);
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      const sheetCount = workbook.SheetNames.length;
      let dataProduct = [];

      for (let i = 0; i < sheetCount; i++) {
        const sheetName = workbook.SheetNames[i];
        const sheetData = workbook.Sheets[sheetName];
        let jsonData = XLSX.utils.sheet_to_json(sheetData, { header: 1 });

        jsonData.shift();
        jsonData.splice(-3);

        jsonData = jsonData.filter((row) =>
          row.some((cell) => cell !== null && cell !== "")
        );

        dataProduct.push({ symbol: sheetName, jsonData });
      }

      setData(dataProduct);
      console.log(dataProduct);
      setIsLoading(false);
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

        /**
         * For Debugging
         */
        // console.log(start, end);
        // console.log(dataRequest[0]);
        // console.log(dataRequest[dataRequest.length - 1]);
        // setIsLoading(false);

        // if (x === 2) {
        //   setIsLoading(false);
        //   break;
        // }

        try {
          const response = await axios.post(
            `${apiURL}/etrade/log-price/winquote`,
            {
              symbol,
              priceData: dataRequest,
              hlprice: { hprice, lprice },
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.headers.statusCode !== 200) {
            toast.update(toastLoading, {
              render: response.data.headers.message,
              type: "error",
              isLoading: false,
              autoClose: 5003,
            });
            isSuccess = false;
            setIsLoading(false);
            break;
          } else {
            const { data } = response.data;
            hprice = data.hprice;
            lprice = data.lprice;
            isSuccess = true;
            await delay(500);
          }
        } catch (err) {
          toast.update(toastLoading, {
            render: err.code,
            type: "error",
            isLoading: false,
            autoClose: 5003,
          });
          setIsLoading(false);
          break;
        }
      }

      if (isSuccess) {
        toast.update(toastLoading, {
          render: `Success Log price ${symbol} to elastic`,
          type: "success",
          autoClose: 5003,
          isLoading: false,
        });
        setIsLoading(false);
        setData([]);
      }
    }
  };

  const handleSubmitChart = async () => {
    const toastLoading = toast.loading(
      `Process Logging Chart for Symbol ${symbol}`
    );
    try {
      if (!token) {
        toast.error("Token cannot be empty!");
        return;
      }

      if (!symbol) {
        toast.error("Please select symbol!");
        return;
      }

      setIsLoading(true);

      const from = `${formatDate(dateFrom)} ${timeFrom}`;
      const to = `${formatDate(dateTo)} ${timeTo}`;

      let dataRequest = {
        symbol: symbol.toUpperCase(),
        from,
        to,
        stepPriceLog: null,
        totalLoop: null,
        lastDocument: null,
        keyRedis: null,
      };

      while (true) {
        const { data } = await axios.post(
          `${apiURL}/etrade/log-chart/price-history`,
          { ...dataRequest },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data.headers.statusCode !== 200) {
          toast.update(toastLoading, {
            render: data.headers.message,
            type: "error",
            isLoading: false,
            autoClose: 5003,
          });
          setIsLoading(false);
          break;
        } else {
          if (data.data.nextPrice) {
            dataRequest.stepPriceLog = data.data.stepPriceLog;
            dataRequest.totalLoop = data.data.totalLoop;
            dataRequest.lastDocument = data.data.lastDocument;
            dataRequest.keyRedis = data.data.keyRedis;
          } else {
            setIsLoading(false);
            toast.update(toastLoading, {
              render: `${data.headers.message}, Price Found: ${data.data.priceFound}`,
              type: "success",
              isLoading: false,
              autoClose: 5003,
            });

            break;
          }
        }
      }
    } catch (error) {
      toast.update(toastLoading, {
        render: error.code,
        type: "error",
        isLoading: false,
        autoClose: 5003,
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="form" style={{ marginBottom: 50 }}>
        <h3>{`Running on ${mode} mode`}</h3>
        <h3>{`${apiURL}`}</h3>
        <div className="input-container ic1">
          <textarea
            className="input"
            type="text area"
            placeholder="Input Token"
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="form">
        <div className="title">Generate Log Price</div>
        <div className="ic2">
          <input id="lastname" type="file" onChange={handleFileChange} />
        </div>
        <button
          type="text"
          onClick={handleSubmitPrice}
          className="submit"
          disabled={isLoading}
        >
          {isLoading ? "Loading Data" : "Submit"}
        </button>
      </div>

      <div className="form" style={{ marginTop: 50 }}>
        <div className="title" style={{ marginBottom: 20 }}>
          Generate Log Chart from Price History
        </div>
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Open Time</th>
              <th>Close Time</th>
            </tr>
          </thead>
          <tbody>
            {openCloseSymbol.map((val) => (
              <tr key={val.symbol}>
                <td>{val.symbol}</td>
                <td>{val.open}</td>
                <td>{val.close}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="input-container-2 ic1">
          <select
            id="fruit-select"
            value={symbol}
            onChange={(e) => {
              setSymbol(e.target.value);
            }}
          >
            <option value="">Select symbol</option>
            {symbols.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <h3 className="label-input">From</h3>
        <div className="input-container-3 ic1">
          {/* <input
            className="input"
            type="text"
            placeholder="Input Date From (YYYY-MM-SS)"
            value={dateFrom}
            onChange={(e) => {
              setFrom(e.target.value);
            }}
          /> */}
          <DatePicker
            className="input date-input"
            selected={dateFrom}
            onChange={(date) => setDateFrom(date)}
          />
          <input
            className="input"
            type="text"
            placeholder="Input Time From (HH:mm:ss)"
            value={timeFrom}
            onChange={(e) => {
              setTimeFrom(e.target.value);
            }}
          />
        </div>
        <h3 className="label-input">To</h3>
        <div className="input-container-3 ic1">
          {/* <input
            className="input"
            type="text"
            placeholder="Input Date To (YYYY-MM-SS)"
            value={dateTo}
            onChange={(e) => {
              setTo(e.target.value);
            }}
          /> */}
          <DatePicker
            className="input date-input"
            selected={dateTo}
            onChange={(date) => setDateTo(date)}
          />
          <input
            className="input"
            type="text"
            placeholder="Input Time To (HH:mm:ss)"
            value={timeTo}
            onChange={(e) => {
              setTimeTo(e.target.value);
            }}
          />
        </div>

        <button
          type="text"
          onClick={handleSubmitChart}
          className="submit"
          disabled={isLoading}
          style={{ marginTop: 20 }}
        >
          {isLoading ? "Loading Data" : "Submit"}
        </button>
      </div>
    </>
  );
}

export default ExcelUploader;
