import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third party
import Chart from 'react-apexcharts';

// project imports
import ChartDataMonth from './chart-data/total-order-month-line-chart';
import ChartDataYear from './chart-data/total-order-year-line-chart';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import axios from 'axios';
import config from 'config';

export default function TotalOrderLineChartCard({ isLoading }) {
  const theme = useTheme();

  const [timeValue, setTimeValue] = React.useState(false);
  const [month, setMonthly] = useState([]);
  const [year, setYearly] = useState([]);
const [acptStat, setAcptStat] = useState([]);


//sort accepted
useEffect(() => {
  axios.get(`${config.baseApi}/request/history`)
    .then((response) => {
      const allData = response.data || [];
      const acceptedData = allData.filter(item => item.request_status === 'accepted');
      setAcptStat(acceptedData);
    });
}, []);

//Fix Date from DB
const parseCustomDate = (dateStr) => {
  const cleaned = dateStr.replace(/\s{2,}/g, ' ').trim();
  const [monthStr, day, year, timeWithAMPM] = cleaned.split(" ");
  const months = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04",
    May: "05", Jun: "06", Jul: "07", Aug: "08",
    Sep: "09", Oct: "10", Nov: "11", Dec: "12"
  };
  const month = months[monthStr];
  if (!month) return null;
  const dayPadded = day.padStart(2, "0");
  const time = timeWithAMPM.replace(/(AM|PM)/, ' $1');

  const fullDateStr = `${year}-${month}-${dayPadded} ${time}`;
  return new Date(fullDateStr);
};

//Display Result
useEffect(() => {
  if (acptStat.length > 0) {
    const sortedByMonth = [...acptStat].sort((a, b) => {
      const dateA = parseCustomDate(a.updated_at);
      const dateB = parseCustomDate(b.updated_at);

      if (!dateA || !dateB) return 0;
      return dateA.getMonth() - dateB.getMonth();
    });
    setMonthly(sortedByMonth.length)
  console.log('MONTH:',sortedByMonth.length)

    const sortedByYear = [...acptStat].sort((a, b) => {
      const date1 = parseCustomDate(a.updated_at);
      const date2 = parseCustomDate(b.updated_at);

      if (!date1 || !date2) return 0;

      return date1.getFullYear() - date2.getFullYear();
    });
    setYearly(sortedByYear.length);
     console.log('YEAR:',sortedByYear.length)
  }
}, [acptStat]); 


  const handleChangeTime = (event, newValue) => {
    setTimeValue(newValue);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTotalOrderCard />
      ) : (
        <MainCard
          border={false}
          content={false}
          sx={{
            bgcolor: 'primary.dark',
            color: '#fff',
            overflow: 'hidden',
            position: 'relative',
            '&>div': {
              position: 'relative',
              zIndex: 5
            },
            '&:after': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.palette.primary[800],
              borderRadius: '50%',
              top: { xs: -85 },
              right: { xs: -95 }
            },
            '&:before': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: 210,
              background: theme.palette.primary[800],
              borderRadius: '50%',
              top: { xs: -125 },
              right: { xs: -15 },
              opacity: 0.5
            }
          }}
        >
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid>
                <Grid container sx={{ justifyContent: 'space-between' }}>
                  <Grid>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.largeAvatar,
                        bgcolor: 'primary.800',
                        color: '#fff',
                        mt: 1
                      }}
                    >
                      <LocalMallOutlinedIcon fontSize="inherit" />
                    </Avatar>
                  </Grid>
                  <Grid>
                    <Button
                      disableElevation
                      variant={timeValue ? 'contained' : 'text'}
                      size="small"
                      sx={{ color: 'inherit' }}
                      onClick={(e) => handleChangeTime(e, true)}
                    >
                      Month
                    </Button>
                    <Button
                      disableElevation
                      variant={!timeValue ? 'contained' : 'text'}
                      size="small"
                      sx={{ color: 'inherit' }}
                      onClick={(e) => handleChangeTime(e, false)}
                    >
                      Year
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid sx={{ mb: 0.75 }}>
                <Grid container sx={{ alignItems: 'center' }}>
                  <Grid size={6}>
                    <Grid container sx={{ alignItems: 'center' }}>
                      <Grid>
                        {timeValue ? (
                          <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>{month}</Typography>
                        ) : (
                          <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>{year}</Typography>
                        )}
                      </Grid>
                      <Grid>
                        <Avatar
                          sx={{
                            ...theme.typography.smallAvatar,
                            cursor: 'pointer',
                            bgcolor: 'primary.200',
                            color: 'primary.dark'
                          }}
                        >
                          <ArrowDownwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
                        </Avatar>
                      </Grid>
                      <Grid size={12}>
                        <Typography
                          sx={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            color: 'primary.200'
                          }}
                        >
                          Total Accepted Requests
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid
                    size={6}
                    sx={{
                      '.apexcharts-tooltip.apexcharts-theme-light': {
                        color: theme.palette.text.primary,
                        background: theme.palette.background.default,
                        ...theme.applyStyles('dark', { border: 'none' })
                      }
                    }}
                  >
                    {timeValue ? <Chart {...ChartDataMonth} /> : <Chart {...ChartDataYear} />}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </MainCard>
      )}
    </>
  );
}

TotalOrderLineChartCard.propTypes = { isLoading: PropTypes.bool };
