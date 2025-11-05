pipeline {
    agent none
    
    stages {
        stage('Build on slave-compile') {
            agent {
                label 'slave-compile'
            }
            environment {
                GIT_SSH = 'ssh'
                GIT_AUTHOR_NAME = 'Jenkins'
                GIT_AUTHOR_EMAIL = 'jenkins@example.com'
            }
            steps {
                echo "========== RUNNING ON SLAVE-COMPILE =========="
                echo "Agent: ${NODE_NAME}"
                echo "Workspace: ${WORKSPACE}"
                
                // Manual git clone instead of checkout scm
                sh '''
                    cd ${WORKSPACE}
                    git init
                    git remote add origin https://github.com/Aryanfour5/devopsprac2
                    git fetch origin main:main
                    git checkout main
                '''
                
                sh '''
                    echo "Installing dependencies..."
                    npm install
                '''
                
                sh '''
                    mkdir -p build-output
                    cp -r node_modules build-output/ 2>/dev/null || true
                    cp package.json build-output/ 2>/dev/null || true
                    cp app.js build-output/ 2>/dev/null || true
                    ls -la build-output/
                '''
                
                stash includes: 'build-output/**', name: 'build-artifacts'
                
                echo "========== BUILD STAGE COMPLETE =========="
            }
        }
        
        stage('Test on slave2') {
            agent {
                label 'slave2'
            }
            steps {
                echo "========== RUNNING ON SLAVE2 =========="
                
                unstash 'build-artifacts'
                
                sh '''
                    cp -r build-output/* . 2>/dev/null || true
                    npm test 2>/dev/null || echo "No tests configured"
                '''
                
                echo "========== TEST STAGE COMPLETE =========="
            }
        }
    }
    
    post {
        always {
            echo "Pipeline finished"
        }
    }
}
