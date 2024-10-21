// request

POST https://graph.microsoft.com/v1.0/search/query

// request body

{
    "requests": [
        {
            "entityTypes": [
                "driveItem"
            ],
            "query": {
                "queryString": "Taskpane"
            }
        }
    ]
}

// response body

{
    value: [
        {
            searchTerms: [
                "Taskpane"
            ],
            hitsContainers: [
                {
                    hits: [
                        {
                            hitId: string,
                            rank: number,
                            summary: string,
                            resource: driveItem
                        },
                        {more hits}
                    ]
                }
            ]
        }
    ],
    @odata.context: url
}