import { Outlet } from 'react-router-dom';
import LayoutWrapper from './LayoutWrapper';

export default function LayoutRouter() {
  return (
    <LayoutWrapper>
      <Outlet />
    </LayoutWrapper>
  );
}

