<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; worker-src 'self' blob:; child-src 'self' blob:">
        <title>CodeCanvas</title>
        <link href="{{ asset('build/assets/main.css') }}" rel="stylesheet">
        <script>
            // Prevent MetaMask injection errors
            window.ethereum = window.ethereum || {
                isMetaMask: true,
                request: async () => {},
                on: () => {},
                removeListener: () => {},
                _metamask: {
                    isUnlocked: () => false,
                },
                isConnected: () => false,
            };
            window.web3 = window.web3 || {
                currentProvider: null,
            };
        </script>
        @vite(['frontend/src/main.tsx'])
    </head>
    <body>
        <div id="root"></div>
    </body>
</html>
