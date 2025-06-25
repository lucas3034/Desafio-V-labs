import styled from 'styled-components';
import { Button, Flex } from '../../styles/GlobalStyles';

const PaginationWrapper = styled.div`
  margin-top: ${props => props.theme.spacing.xl};
`;

const PageButton = styled(Button)`
  min-width: 40px;
  padding: ${props => props.theme.spacing.sm};
  
  ${props => props.active && `
    background: ${props.theme.colors.primary};
    color: ${props.theme.colors.white};
  `}
`;

const PageInfo = styled.span`
  color: ${props => props.theme.colors.gray600};
  font-size: 0.875rem;
`;

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  hasNextPage, 
  hasPreviousPage 
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <PaginationWrapper>
      <Flex justify="space-between" align="center" wrap>
        <PageInfo>
          Página {currentPage} de {totalPages}
        </PageInfo>
        
        <Flex align="center" gap="0.5rem">
          <Button
            variant="secondary"
            size="small"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPreviousPage}
          >
            Anterior
          </Button>

          {visiblePages.map((page, index) => (
            page === '...' ? (
              <span key={index} style={{ padding: '0 0.5rem' }}>...</span>
            ) : (
              <PageButton
                key={page}
                variant="secondary"
                size="small"
                active={page === currentPage}
                onClick={() => onPageChange(page)}
              >
                {page}
              </PageButton>
            )
          ))}

          <Button
            variant="secondary"
            size="small"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
          >
            Próxima
          </Button>
        </Flex>
      </Flex>
    </PaginationWrapper>
  );
};

export default Pagination;
