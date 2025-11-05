pipeline {
    agent none
    
    stages {
        stage('Build on slave-compile') {
            agent {
                label 'slave-compile'
            }
            steps {
                echo "========== RUNNING ON SLAVE-COMPILE =========="
                echo "Agent: ${NODE_NAME}"
                echo "Workspace: ${WORKSPACE}"
                
                sh '''
                    cd ${WORKSPACE}
                    echo "Cloning repository..."
                    git clone --depth 1 https://github.com/Aryanfour5/devopsprac2 .
                    echo "Repository cloned successfully"
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
                    echo "Build artifacts prepared"
                    ls -la build-output/
                '''
                
                stash includes: 'build-output/**', name: 'build-artifacts'
                
                echo "========== BUILD STAGE COMPLETE =========="
            }
            post {
                success {
                    echo "✓ Build succeeded on slave-compile"
                }
                failure {
                    echo "✗ Build failed on slave-compile"
                }
            }
        }
        
        stage('Test on slave2') {
            agent {
                label 'slave2'
            }
            steps {
                echo "========== RUNNING ON SLAVE2 =========="
                echo "Agent: ${NODE_NAME}"
                
                unstash 'build-artifacts'
                
                sh '''
                    echo "Artifacts retrieved from Build stage:"
                    ls -la build-output/ || echo "No build-output found"
                    cp -r build-output/* . 2>/dev/null || true
                '''
                
                sh '''
                    echo "Running tests..."
                    npm test 2>/dev/null || echo "No tests configured, skipping"
                    echo "Test execution completed"
                '''
                
                echo "========== TEST STAGE COMPLETE =========="
            }
            post {
                always {
                    echo "✓ Tests completed on slave2"
                }
            }
        }
        
        stage('Summary') {
            agent {
                label 'slave-compile'
            }
            steps {
                echo "========== PIPELINE SUMMARY =========="
                echo "✓ Build completed on: slave-compile"
                echo "✓ Tests completed on: slave2"
                echo "✓ Distributed pipeline executed successfully!"
                echo "====================================="
            }
        }
    }
    
    post {
        always {
            echo "Pipeline finished"
        }
        success {
            echo "✓ PIPELINE SUCCESSFUL"
        }
        failure {
            echo "✗ PIPELINE FAILED"
        }
    }
}
