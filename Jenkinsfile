#!/usr/bin/env groovy

def bob = "bob/bob -r \${WORKSPACE}/cicd/precodereview/ruleset2.0.yaml"

pipeline {
    agent {
        node {
            label SLAVE
        }
    }

    stages {
        stage('Cleaning Git Repo') {
            steps {
                sh 'git clean -xdff'
                sh 'git submodule sync'
                sh 'git submodule update --init --recursive'
            }
        }
        stage('Build RPT Services') {
            steps {
                sh "${bob} clean-up"
                sh "${bob} set-env-variables"
                sh "${bob} build-services"
            }
        }
        stage('Running Express Tests') {
            steps {
                sh "${bob} express-test"
            }
        }
       stage('Running Angular Tests') {
           steps {
               sh "${bob} angular-test"
           }
       }
       stage('Express SonarQube Analysis') {
            environment {
                TOKEN = sh(script: 'curl -X POST -u admin:admin --data "name=test-token" http://localhost:9000/api/user_tokens/generate | jq .token', returnStdout: true)
            }
            steps {
                withSonarQubeEnv('SonarQube') {
                        sh "docker run -v ~/jenkins/fem12s11/workspace/resource-pooling-tool_PreCodeReview/:/usr/src/ --rm --network=\"host\" armdocker.rnd.ericsson.se/dockerhub-ericsson-remote/sonarsource/sonar-scanner-cli:4.5 \
                        -Dsonar.sources=./services/express \
                        -Dsonar.projectKey=rpt-express \
                        -Dsonar.projectName=rpt-express \
                        -Dsonar.login=$TOKEN"
                }
            }
       }
       stage('SonarQube Quality Gate') {
            steps {
                waitForQualityGate(abortPipeline: true, webhookSecretId: '')
            }
       }
    }
    post {
        always {
            sh "${bob} clean-up"
            cleanWs()
        }
    }
}
