import { useEffect, useState } from 'react';
// material-ui
import Grid from '@mui/material/Grid2';
import { Typography, Box } from '@mui/material';


import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from '../../../ui-component/cards/TotalIncomeDarkCard';
import TotalIncomeLightCard from '../../../ui-component/cards/TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';

import { gridSpacing } from 'store/constant';

// assets
import ThumbDownIcon from '@mui/icons-material/ThumbDown';


// ==============================|| DEFAULT DASHBOARD ||============================== //

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing} sx={{mt:6}}>
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
  <Box
    sx={{
      p: 1,
      height: '100%',
      display: 'flex',
      alignItems: 'center'
    }}
  >
    <Typography
      variant="h4"
      sx={{
        fontWeight: 900, // Stronger bold
        fontSize: {
          xs: '1.8rem',
          sm: '2.3rem',
          md: '2.8rem',
          lg: '3.2rem'
        },
        textAlign: 'justify',
        lineHeight: 1.3,
        color: '#1b4332',
        letterSpacing: '1px',
        
        textShadow: `
          2px 2px 3px rgba(0,0,0,0.2),
          0px 0px 1px rgba(27, 67, 50, 0.8)
        `,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          textShadow: `
            3px 3px 6px rgba(146, 146, 4, 0.71),
            0px 0px 4px rgba(148, 148, 0, 0.54)
          `,
          transform: 'scale(1.015)'
        }
      }}
    >
      How many have we helped so far?
    </Typography>
  </Box>
</Grid>
          <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
            <TotalOrderLineChartCard isLoading={isLoading} />
          </Grid>
          <Grid size={{ lg: 4, md: 12, sm: 12, xs: 12 }}>
            <Grid container spacing={gridSpacing}>
              <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                <TotalIncomeDarkCard isLoading={isLoading} />
              </Grid>
              <Grid size={{ sm: 6, xs: 12, md: 6, lg: 12 }}>
                <TotalIncomeLightCard
                  {...{
                    isLoading: isLoading,
                    label: 'Total Rejected Requests',
                    icon: <ThumbDownIcon fontSize="inherit" />
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ xs: 12, md: 12 }}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          
        </Grid>
      </Grid>
    </Grid>
  );
}
