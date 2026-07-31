module.exports = [
    {
        files: ['js/**/*.js', 'service-worker.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                localStorage: 'readonly',
                location: 'readonly',
                confirm: 'readonly',
                console: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                Chart: 'readonly',
                XLSX: 'readonly',
                caches: 'readonly',
                self: 'readonly',
                clients: 'readonly'
            }
        },
        rules: {
            'no-undef': 'error',
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_', caughtErrors: 'none' }]
        }
    }
];
