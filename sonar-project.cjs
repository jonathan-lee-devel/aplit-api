const sonarqubeScanner = require('sonarqube-scanner');
sonarqubeScanner(
    {
      serverUrl: 'http://localhost:9000',
      options: {
        'sonar.sources': 'src',
        'sonar.tests': 'src',
        'sonar.inclusions': '**',
        'sonar.test.inclusions':
        'src/**/*.spec.ts,src/**/*.spec.tsx,src/**/*.test.ts,src/**/*.test.tsx',
        'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
        'sonar.login': '2983efcb7d2b8754a6fe7e12080503cea0b5eb1d',
      },
    },
    () => {},
);
