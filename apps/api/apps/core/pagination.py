from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'success': True,
            'data': data,
            'meta': {
                'pagination': {
                    'page': self.page.number,
                    'pageSize': self.get_page_size(self.request),
                    'totalCount': self.page.paginator.count,
                    'totalPages': self.page.paginator.num_pages,
                    'hasNext': self.page.has_next(),
                    'hasPrevious': self.page.has_previous(),
                }
            }
        })
