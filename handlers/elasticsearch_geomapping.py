import os
from elasticsearchquery import ElasticSearchQuery


def handler(event, context):
    esQuery = ElasticSearchQuery(
        es_endpoint=os.environ['ES_ENDPOINT'],
        index_name=os.environ['ES_INDEX'],
        query_file=os.environ['ES_GEO_MAPPING_FILE'],
        region=os.environ['ES_REGION'],
    )
    esQuery.run()