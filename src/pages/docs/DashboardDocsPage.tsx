import { PageHeader } from '../../shared/ui/PageHeader';
import { ApiDocsContent } from '../../widgets/api-docs/ApiDocsContent';

export const DashboardDocsPage = () => (
  <>
    <PageHeader title="API документація" subtitle="Детальний опис внутрішньої структури API та інтеграції." />
    <ApiDocsContent detailed />
  </>
);
