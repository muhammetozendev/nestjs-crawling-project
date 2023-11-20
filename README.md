# Description

Crawling Project

# Required Environment Variables

- `POSTGRES_HOST`: Hostname for postgres db
- `POSTGRES_PORT`: Database port
- `POSTGRES_USER`: Database user
- `POSTGRES_PASS`: Database password
- `POSTGRES_DB`: Database schema

- `REDIS_HOST`: Redis database hostname
- `REDIS_PORT`: Redis database port
- `REDIS_PASS`: Redis database password (optional)

- `MAX_CONCURRENT_JOBS`: Max number of jobs that can run cuncorrently (for rate limiting)
- `MAX_CONCURRENT_JOBS_DURATION`

- `MAX_RETRY_COUNT`: Max number of attempts for each job in case of failure
- `BACKOFF_DURATION`: Duration to wait before starting the next attempt
