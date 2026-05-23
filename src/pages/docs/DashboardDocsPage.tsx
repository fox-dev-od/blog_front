import { PageHeader } from '../../shared/ui/PageHeader';
import { ApiDocsContent } from '../../widgets/api-docs/ApiDocsContent';

export const DashboardDocsPage = () => (
  <>
    <PageHeader title="API документація" subtitle="Публічні endpoints і приклади інтеграції." />
    <ApiDocsContent />
  </>
);
