import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Checkbox, Typography } from '@mui/material';
import classes from "./App.module.css";

interface Ticket {
  // Цена в рублях
  price: number
  // Код авиакомпании (iata)
  carrier: string
  // Массив перелётов.
  // В тестовом задании это всегда поиск "туда-обратно" значит состоит из двух элементов
  segments: [
    {
      // Код города (iata)
      origin: string
      // Код города (iata)
      destination: string
      // Дата и время вылета туда
      date: string
      // Массив кодов (iata) городов с пересадками
      stops: string[]
      // Общее время перелёта в минутах
      duration: number
    },
    {
      // Код города (iata)
      origin: string
      // Код города (iata)
      destination: string
      // Дата и время вылета обратно
      date: string
      // Массив кодов (iata) городов с пересадками
      stops: string[]
      // Общее время перелёта в минутах
      duration: number
    }
  ]
}

const App: React.FC = () => {
  const [searchId, setSearchId] = useState<string>('');
  const [tickets, setTickets] = useState<Ticket[] | null | undefined>(null);

  const onCheapest = useCallback(() => {
    const result: Ticket[] | null | undefined = tickets && [...tickets].sort((startTic, endTic) => startTic.price - endTic.price)
    setTickets(result);

    console.log(result);
  }, [tickets])

  const getTime = (minutes: number) => {
    let hrs = Math.trunc(minutes / 60);
    let mins = minutes % 60;

    return hrs + "ч. " + mins + "м."
  }

  useEffect(() => {
    fetch('https://front-test.beta.aviasales.ru/search').then(res => {
      return res.json();
    }).then(res => {
      setSearchId(res.searchId);
    })
  }, []);

  useEffect(() => {
    if (searchId) {
      fetch(`https://front-test.beta.aviasales.ru/tickets?searchId=${searchId}`).then(res => {
        return res.json()
      }).then(res => {
        setTickets(res.tickets.filter((el: any, index: number) => index <= 10));
      })
    }
  }, [searchId])

  return (
    <div className={classes.main}>
      <Box sx={{ boxShadow: 3 }} className="filters">
        <Typography style={{ textTransform: "uppercase", fontSize: 18 }} variant="h6" component="h6">Количество пересадок</Typography>
        <Box>
          <label>
            <Checkbox style={{ color: "#1976d2" }} />
            Все
          </label>
        </Box>
        <Box>
          <label>
            <Checkbox style={{ color: "#1976d2" }} />
            Без пересадок
          </label>
        </Box>
        <Box>
          <label>
            <Checkbox style={{ color: "#1976d2" }} />
            1 пересадка
          </label>
        </Box>
        <Box>
          <label>
            <Checkbox style={{ color: "#1976d2" }} />
            2 пересадки
          </label>
        </Box>
        <Box>
          <label>
            <Checkbox style={{ color: "#1976d2" }} />
            3 пересадки
          </label>
        </Box>
      </Box>
      <div className="container-tickets">
        <div className="ticket-filters">
          <Button size="large" variant="outlined" onClick={onCheapest}>Самый дешевый</Button>
          <Button size="large" variant="contained" color="primary">Самый быстрый</Button>
        </div>
        <div className="box-tickets">
          {
            tickets?.map(tic => {
              return <div className={classes.boxTicket} key={tic.price + tic.carrier}>
                <h4>{tic.price} UAH</h4>
                <div className={classes.segments}>
                  {
                    tic.segments?.map((seg: any) => {
                      return <div className={classes.infoTicket} key={seg.origin + seg.destination}>
                        <div>
                          <div className="gray">{seg.origin} - {seg.destination}</div>
                          <div>{seg.date}</div>
                        </div>
                        <div>
                          <span className="gray">В пути</span>
                          <div>{getTime(seg.duration)}</div>
                        </div>
                        <div>
                          <span className="gray">{seg.stops.length} пересадки</span>
                          <div>
                            {
                              seg.stops && seg.stops?.map((st: string, index: number) => {
                                return <span key={index}>
                                  <span>{st}</span>
                                </span>
                              })
                            }
                          </div>
                        </div>
                      </div>
                    })
                  }
                </div>
              </div>
            })
          }
        </div>
      </div>
    </div>
  )
}

export default App
