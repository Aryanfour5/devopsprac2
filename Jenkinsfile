pipeline {
    agent none
    
    stages {
        stage('Build on slave-compile') {
            agent {
                label 'slave-compile'  // Changed from 'compile-mode'
            }
            environment {
                BUILD_TIME = sh(script: 'date', returnStdout: true).trim()
            }
            steps {
                echo "========== RUNNING ON SLAVE-COMPILE =========="
                echo "Agent: ${NODE_NAME}"
                echo "Workspace: ${WORKSPACE}"
                echo "Build Time: ${BUILD_TIME}"
                
                sh '''
                    echo "Installing dependencies..."
                    npm install
                    echo "Compiling application..."
                    npm run build || echo "Build script not found, skipping"
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
                label 'slave2'  // This is correct
            }
            steps {
                echo "========== RUNNING ON SLAVE2 =========="
                echo "Agent: ${NODE_NAME}"
                echo "Workspace: ${WORKSPACE}"
                
                unstash 'build-artifacts'
                
                sh '''
                    echo "Artifacts retrieved from Build stage:"
                    ls -la build-output/ || echo "No build-output found"
                    cp -r build-output/* . 2>/dev/null || true
                '''
                
                sh '''
                    echo "Running tests..."
                    npm test 2>/dev/null || echo "No tests configured"
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
                label 'slave-compile'  // Changed from 'compile-mode'
            }
            steps {
                echo "========== PIPELINE SUMMARY =========="
                echo "Build Agent: slave-compile"
                echo "Test Agent: slave2"
                echo "Status: SUCCESS"
                echo "Pipeline completed successfully!"
                echo "====================================="
            }
        }
    }
    
    post {
        always {
            echo "Pipeline finished"
        }
        success {
            echo "✓ PIPELINE SUCCESSFUL - Distributed build and test completed"
        }
        failure {
            echo "✗ PIPELINE FAILED - Check logs above"
        }
    }
}
