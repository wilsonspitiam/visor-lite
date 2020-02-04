'use strict';

module.exports = {
    main: function (callback) {
        // [START bigquery_query]
        // [START bigquery_client_default_credentials]
        // Import the Google Cloud client library using default credentials
        const {BigQuery} = require('@google-cloud/bigquery');
        const bigquery = new BigQuery();
        // [END bigquery_client_default_credentials]
        async function query() {
        // Queries the U.S. given names dataset for the state of Texas.

        const query = `SELECT
        *,
        SAFE.ST_GeogFromGeoJSON( geom ) AS g
      FROM
        \`glocalizacion.MGN2005.MGN_Manzana\`
      WHERE
        SUBSTR(CAST(SETR_CLSE_ AS STRING), 0, 2) = '68' AND  
        ST_INTERSECTSBOX (SAFE.ST_GeogFromGeoJSON( geom ),
          -73.21895042932569,
          7.1143348398970545,
          -73.21720162904798,
          7.115219807292465) = TRUE
      LIMIT
        10`;

        // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
        const options = {
            query: query,
            // Location must match that of the dataset(s) referenced in the query.
            location: 'US',
        };

        // Run the query as a job
        const [job] = await bigquery.createQueryJob(options);
        console.log(`Job ${job.id} started.`);

        // Wait for the query to finish
        const [rows] = await job.getQueryResults();

        return callback(rows);
        // Print the results
        // console.log('Rows:');
        // rows.forEach(row => console.log(row));
        }
        // [END bigquery_query]
        query();
    }
}
