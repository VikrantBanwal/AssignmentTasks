import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import config from '../../Config/config.json';
import actions from '../../Redux/actions'
import storeKeys from '../../Redux/storeDataKeys'
import Widget from './widget'
import { CONNECTION_STATUS, SUBSCRIPTION_STATUS } from '../../Utils/Constants'

const TickerWidget = () => {
  const [socketInstance, updateSocketInstance] = useState(null)
  const [connectionStatus, updateConnectionStatus] = useState(CONNECTION_STATUS.DISCONNECTED)
  const [subscriptonStatus, updateSubscriptionStatus] = useState(SUBSCRIPTION_STATUS.UNSUBSCRIBED)
  const dispatch = useDispatch();
  const [cryptoName, updateCryptoName] = useState('')
  const cryptoNameChangeHandler = useCallback(e => updateCryptoName(e.target.value), [])

  const connectToServer = () => {
    const socket = new WebSocket(config.TICKER_SOCKET_ENDPOINT)

    socket.onopen = () => {
      console.log('Connection Established With Socket Server');
      updateConnectionStatus(CONNECTION_STATUS.CONNECTED);
    };
    updateSocketInstance(socket)

    socket.onerror = err => {
      console.log('Error on Socket', err)
      updateConnectionStatus(CONNECTION_STATUS.ERROR)
    }
    return socket;
  }

  useEffect(() => {
    const socket = connectToServer()
    return socket.close()
  }, []);

  const subscribe = useCallback(() => {
    console.log('Trying to Subscrible', cryptoName)
    socketInstance.send(JSON.stringify({
      event: 'subscribe',
      channel: 'ticker',
      symbol: cryptoName   //'tBTCUSD'
    }));

    socketInstance.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        console.log("Message Recieved ", data);
        if (data?.event) {
          if (data?.event === SUBSCRIPTION_STATUS.SUBSCRIBED) {
            updateSubscriptionStatus(SUBSCRIPTION_STATUS.SUBSCRIBED)
          } else {
            updateSubscriptionStatus(SUBSCRIPTION_STATUS.UNSUBSCRIBED)
          }
        }
        if (Array.isArray(data) && Array.isArray(data[1])) {
          console.log("Subscription Message", { cryptoName })
          // Saving data in redux
          dispatch({ type: actions.SAVE_TICKER_DATA, [storeKeys.TICKER_DATA]: { name: cryptoName, data } })
        }
      } catch (err) {
        console.error("Error in Message callback", err)
      }
    }
  }, [socketInstance, cryptoName, dispatch])


  return <>
    <div className='connectionStatus'>
      <span>Connection Status</span>
      <span className={connectionStatus === CONNECTION_STATUS.CONNECTED ? 'green' : ''}>
        {connectionStatus === CONNECTION_STATUS.CONNECTED ? 'CONNECTED' : 'NOT CONNECTED'}
      </span>
      {connectionStatus !== CONNECTION_STATUS.CONNECTED &&
        <span>
          <button onClick={connectToServer}>Connect</button>
        </span>
      }
    </div><br />
    <div className='subscriptionStatus'>
      <span>Subscription Status</span>
      <span className={subscriptonStatus === SUBSCRIPTION_STATUS.SUBSCRIBED ? 'green' : ''}>
        {subscriptonStatus}
      </span>
      {(subscriptonStatus !== SUBSCRIPTION_STATUS.SUBSCRIBED && connectionStatus === CONNECTION_STATUS.CONNECTED) &&
        <span>
          <input type='text' onChange={cryptoNameChangeHandler} placeholder='Enter Crypto Name' />
          <button onClick={subscribe}>Subscribe</button>
          (e.g tBTCUSD)
        </span>
      }
    </div>
    <Widget />
    <br />
  </>;
};

export default TickerWidget;
