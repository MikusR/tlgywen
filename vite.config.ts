import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import * as child from "child_process";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
const commitHash = child.execSync('git log -1 --pretty=\'format:%h %ad\' --date=iso8601 HEAD').toString();

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        __COMMIT_HASH__: JSON.stringify(commitHash),
    },
    plugins: [react()],
    base: "/tlgywen/"
})
