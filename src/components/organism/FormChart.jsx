import { OPEN_CLOSE_SYMBOLS, SYMBOLS } from "../../helper/symbol";
import { useChartStore } from "../../store/chartStore";
import { useLoadingStore } from "../../store/loadingStore";
import { useTokenStore } from "../../store/tokenStore";
import ButtonSubmit from "../atom/ButtonSubmit";
import DateInput from "../atom/DateInput";
import Select from "../atom/Select";
import TextInput from "../atom/TextInput";
import { toast } from "react-toastify";
import { formatDate } from "../../helper";
import { generateLogChart } from "../../api/apiService";
import HelpTooltip from "../atom/HelpTooltip";

function FormChart() {
  const { token } = useTokenStore();
  const { isLoading, setIsLoading } = useLoadingStore();
  const {
    symbol,
    dateFrom,
    dateTo,
    timeFrom,
    timeTo,
    setSymbol,
    setDateFrom,
    setDateTo,
    setTimeFrom,
    setTimeTo,
  } = useChartStore();

  const handleSubmitChart = async () => {
    try {
      if (!token) {
        toast.error("Token cannot be empty!");
        return;
      }

      if (!symbol) {
        toast.error("Please select symbol!");
        return;
      }

      const toastLoading = toast.loading(
        `Process Logging Chart for Symbol ${symbol}`
      );

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
        const { error, message, data } = await generateLogChart(
          dataRequest,
          token
        );

        if (error) {
          toast.update(toastLoading, {
            render: message,
            type: "error",
            isLoading: false,
            closeOnClick: true,
          });
          setIsLoading(false);
          break;
        } else {
          if (data.nextPrice) {
            dataRequest.stepPriceLog = data.stepPriceLog;
            dataRequest.totalLoop = data.totalLoop;
            dataRequest.lastDocument = data.lastDocument;
            dataRequest.keyRedis = data.keyRedis;

            const percentage = Math.floor(
              (data.stepPriceLog / data.totalLoop) * 100
            );
            toast.update(toastLoading, {
              render: `Generating Chart ${percentage}%`,
              type: "info",
              isLoading: true,
            });
          } else {
            setIsLoading(false);
            toast.update(toastLoading, {
              render: `${message}, Price Found: ${data.priceFound}`,
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
      <HelpTooltip>
        <p>
          1. Choose symbol want to generate, the table is used to inform symbol
          open and close time
        </p>
        <p>
          2. Fill up the input field on from and to, the `from` value must less
          than `to` value, otherwise the service will error
        </p>
        <p>
          3. After filling up the required field, click on submit button and
          wait until the generate function finish, same as price when the
          generated log chart is finished check the chart data on menu chart
          admin or client
        </p>
      </HelpTooltip>
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
          {OPEN_CLOSE_SYMBOLS.map((val) => (
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
          values={SYMBOLS}
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
