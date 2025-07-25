<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ContentSecurityPolicy
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        $response->headers->set('Content-Security-Policy', "
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;
            style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
            img-src 'self' data: https:;
            font-src 'self' data:;
            worker-src 'self' blob:;
            child-src 'self' blob:;
            connect-src 'self' https://cdn.jsdelivr.net ws: wss:;
        ");

        return $response;
    }
}
