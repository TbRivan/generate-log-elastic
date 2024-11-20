# Generate Log to Elastic

This service used to generate log price and chart to elastic, the price data is generated from winquote with excel format, and the chart is generated from price-history on elastic.

---

## How to run

### 1. Input Token

Select Environment

```
    Development (Running on local development)
```

```
    LAB (Running on lab mode)
```

```
    UAT (Running on uat mode)
```

Get token from web admin, copy and paste on field token and click button set token

### 3. Generate Log Price

Choose file price data with format excel obtained from `winquote`, after uploading file, wait to file to be loaded

If loaded successfully table on form will appear and please check the value, date from and to within the file

If the format excel is not in accordance with the desired format, the popup message will appear, please check the file again

When all the good things ready to generate, click submit button and wait until the web finish generate the log to elastic, after finish generate log price consider checking the price on menu `price-history` in `web admin`

### 4. Generate Chart

Choose symbol want to generate, the table above is used to inform symbol open and close time

Fill up the input field on from and to, the `from` value must less than `to` value, otherwise the service will error

After filling up the required field, click on submit button and wait until the generate function finish, same as price when the generated log chart is finished check the chart data on menu chart admin or client
