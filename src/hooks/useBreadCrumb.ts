import { RootState } from '@/redux/storage';
import { updateBreadcrumbs } from '@/redux/storage/slices/pageStatesSlice';
import { BreadcrumbItem } from 'pendig-fro-transversal-lib-react/dist/components/Breadcrumb/IBreadcrumb';
import { useDispatch, useSelector } from 'react-redux';

const useBreadCrumb = () => {
  const { breadcrumbs } = useSelector((state: RootState) => state.pageState);
  const dispatch = useDispatch();

  const updatePaths = (pathname: BreadcrumbItem[]) => {
    dispatch(
      updateBreadcrumbs(
        pathname.map((item) => ({
          ...item,
          $href: `${process.env.NEXT_PUBLIC_URL_HOST ?? ''}${item.$href}`,
        }))
      )
    );
  };

  return { breadcrumbs, updatePaths };
};

export default useBreadCrumb;
