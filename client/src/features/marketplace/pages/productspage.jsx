import Container from "../../../shared/layouts/Container";
import ProductsContent from "../index";

export default function ProductsPage({ filters }) {
  
  return (
    <Container className="py-0">
      <ProductsContent filters={filters} />
    </Container>
  );
}