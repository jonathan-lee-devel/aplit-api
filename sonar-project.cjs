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
        'sonar.login': 'bc784ac47b3fa25474d6610daed7d09af0a78354',
      },
    },
    () => {},
);
