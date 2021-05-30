import { useSelector } from "react-redux"
import storeKeys from '../../Redux/storeDataKeys'


const Widget = () => {
  const tickerData = useSelector(state => state[storeKeys.TICKER_DATA])
  console.log('Ticker Data', tickerData);
  if (!tickerData) {
    return <div className="tickerWidgetContainer" />
  }
  const cryptoName = tickerData.name
  const lastPrice = tickerData.data[1][6];
  return (
    <div className="tickerWidgetContainer">
      <div className='cryptoName'>{cryptoName}</div>
      <div className='lastPrice'>
        <span>Last Amount: </span>
        <span>{lastPrice}</span>
      </div>
    </div>
  )
}

export default Widget