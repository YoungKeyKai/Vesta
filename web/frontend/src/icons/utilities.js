import { Wifi, ElectricBolt, Kitchen, LocalLaundryService, LocalDining } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

export const baseColor = '#283860';

export const WifiTooltip = () => {
  return (
    <Tooltip title="Wifi" key='wifiTooltip'>
      <Wifi sx={{ color: baseColor }} key='wifi' />
    </Tooltip>
  );   
}

export const ElectricToolTip = () => {
  return (
    <Tooltip title="Hydro" key='hydroTooltip'>
      <ElectricBolt sx={{ color: baseColor }} key='hydro' />
    </Tooltip>
  );   
}

export const KitchenTooltip = () => {
  return (
    <Tooltip title="Kitchen" key='kitchenTooltip'>
      <Kitchen sx={{ color: baseColor }} key='kitchen' />
    </Tooltip>
  );   
}

export const LaundryTooltip = () => {
  return (
    <Tooltip title="Laundry" key='laundryTooltip'>
      <LocalLaundryService sx={{ color: baseColor }} key='laundry' />
    </Tooltip>
  );   
}

export const LocalDiningTooltip = () => {
  return (
    <Tooltip title="Local Dining" key='localDiningTooltip'>
      <LocalDining sx={{ color: baseColor }} key='localDining' />
    </Tooltip>
  );   
}