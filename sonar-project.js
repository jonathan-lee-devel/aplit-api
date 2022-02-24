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
        'sonar.login': '7e0906f86ddc29d048f2ad4dec7dfb15ef25f185',
      },
    },
    () => {},
);
