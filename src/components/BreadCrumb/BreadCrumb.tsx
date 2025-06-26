import useBreadCrumb from '@/hooks/useBreadCrumb';
import { useRouter } from 'next/router';
import { Breadcrumb } from 'pendig-fro-transversal-lib-react';
import { BreadcrumbItem } from 'pendig-fro-transversal-lib-react/dist/components/Breadcrumb/IBreadcrumb';

export const BreadCrumb = () => {
  const { breadcrumbs } = useBreadCrumb();
  const router = useRouter();

  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  return (
    <Breadcrumb
      $items={breadcrumbs.map((item: BreadcrumbItem) => ({
        ...item,
        onClick: () => {
          router.push(item.$href ?? '/');
        },
      }))}
    />
  );
};
