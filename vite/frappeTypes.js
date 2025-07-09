import path from 'path'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function frappeTypes(options = {}) {
  let childProcess = null

  return {
    name: 'frappeui-types-plugin',
    config: (config, { command, mode }) => {
      if (mode === 'development') {
        // Run the type generation in a separate process
        const scriptPath = path.join(__dirname, 'generateTypes.js')

        // Serialize options as a JSON string to pass to the child process
        const optionsArg = JSON.stringify(options)

        childProcess = spawn('node', [scriptPath, optionsArg], {
          stdio: ['ignore', 'pipe', 'pipe'], // Ignore stdin, pipe stdout/stderr
          detached: false,
        })

        // Pipe stdout and stderr
        childProcess.stdout.pipe(process.stdout)
        childProcess.stderr.pipe(process.stderr)

        // Handle child process errors
        childProcess.on('error', (err) => {
          console.error('Error in type generation process:', err)
        })

        const cleanup = () => {
          if (childProcess && !childProcess.killed) {
            try {
              // Send SIGTERM signal
              childProcess.kill('SIGTERM')

              // Force kill if needed after a timeout
              setTimeout(() => {
                if (childProcess && !childProcess.killed) {
                  childProcess.kill('SIGKILL')
                }
              }, 500)
            } catch (e) {
              // Ignore errors during cleanup
            }
          }
        }

        // Register cleanup on exit signals and process exit
        ;['SIGINT', 'SIGTERM', 'exit'].forEach((signal) => {
          process.once(signal, cleanup)
        })

        // Handle child process exit
        childProcess.on('exit', (code, signal) => {
          childProcess = null
          if (code !== 0 && !signal) {
            console.log(`Type generation process exited with code ${code}`)
          }
        })
      }
      return {}
    },
  }
}
