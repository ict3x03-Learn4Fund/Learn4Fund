pipeline {
    agent any
    tools {nodejs "Default"}

    stages {
        stage("Fetch") {
            steps {
                git branch: "dev",
                    url: "https://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@github.com/ict3x03-Learn4Fund/Learn4Fund.git"
            }
        }
        stage("Install") {
            parallel {
                stage("Frontend") {
                    steps {
                        dir('frontend') {
                            sh 'rm package-lock.json'
                            sh 'rm -rf node_modules'
                            sh 'npm install'
                        }
                    }
                }
                stage("Backend") {
                    steps {
                        dir('backend') {
                            sh 'rm package-lock.json'
                            sh 'rm -rf node_modules'
                            sh 'npm install'
                        }
                    }
                }
            }
        }
        stage("Dep Check") {
            steps {
                dependencyCheck additionalArguments: '--format HTML --format XML --disableYarnAudit', odcInstallation: 'Default'
            }
        }
    }
    post {
        success {
            dependencyCheckPublisher pattern: 'dependency-check-report.xml'
        }
    }
}
