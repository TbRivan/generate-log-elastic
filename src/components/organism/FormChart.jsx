import { openCloseSymbol, symbols } from "../../helper/symbol";
import { useChartStore } from "../../store/chartStore";
import { useLoadingStore } from "../../store/loadingStore";
import { useTokenStore } from "../../store/tokenStore";
import ButtonSubmit from "../atom/ButtonSubmit";
import DateInput from "../atom/DateInput";
import Select from "../atom/Select";
import TextInput from "../atom/TextInput";
import { toast } from "react-toastify";
import axios from "axios";
import { formatDate } from "../../helper";

function FormChart({ apiURL }) {
  const token = useTokenStore((state) => state.token);
  const isLoading = useLoadingStore((state) => state.isLoading);
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);
  const symbol = useChartStore((state) => state.symbol);
  const dateFrom = useChartStore((state) => state.dateFrom);
  const dateTo = useChartStore((state) => state.dateTo);
  const timeFrom = useChartStore((state) => state.timeFrom);
  const timeTo = useChartStore((state) => state.timeTo);
  const setSymbol = useChartStore((state) => state.setSymbol);
  const setDateFrom = useChartStore((state) => state.setDateFrom);
  const setDateTo = useChartStore((state) => state.setDateTo);
  const setTimeFrom = useChartStore((state) => state.setTimeFrom);
  const setTimeTo = useChartStore((state) => state.setTimeTo);

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
            closeOnClick: true,
          });
          setIsLoading(false);
          break;
        } else {
          if (data.data.nextPrice) {
            dataRequest.stepPriceLog = data.data.stepPriceLog;
            dataRequest.totalLoop = data.data.totalLoop;
            dataRequest.lastDocument = data.data.lastDocument;
            dataRequest.keyRedis = data.data.keyRedis;

            const percentage = Math.floor(
              (data.data.stepPriceLog / data.data.totalLoop) * 100
            );
            toast.update(toastLoading, {
              render: `Generating Chart ${percentage}%`,
              type: "info",
              isLoading: true,
            });
          } else {
            setIsLoading(false);
            toast.update(toastLoading, {
              render: `${data.headers.message}, Price Found: ${data.data.priceFound}`,
              type: "success",
              isLoading: false,
              closeOnClick: true,
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
        closeOnClick: true,
      });
      setIsLoading(false);
    }
  };

  return (
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
        <Select
          value={symbol}
          onChange={setSymbol}
          values={symbols}
          label={"Select Symbol"}
        />
      </div>
      <h3 className="label-input">From</h3>
      <div className="input-container-3 ic1">
        <DateInput value={dateFrom} onChange={setDateFrom} />
        <TextInput
          value={timeFrom}
          onChange={setTimeFrom}
          placeholder={"Input Time From (HH:mm:ss)"}
        />
      </div>
      <h3 className="label-input">To</h3>
      <div className="input-container-3 ic1">
        <DateInput value={dateTo} onChange={setDateTo} />
        <TextInput
          value={timeTo}
          onChange={setTimeTo}
          placeholder={"Input Time To (HH:mm:ss)"}
        />
      </div>

      <ButtonSubmit
        onClick={handleSubmitChart}
        disabled={isLoading}
        style={{ marginTop: 20 }}
      >
        {isLoading ? "Loading Data" : "Submit"}
      </ButtonSubmit>
    </div>
  );
}

export default FormChart;
