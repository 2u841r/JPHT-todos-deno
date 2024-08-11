import { data } from "./data.js";

Deno.serve((req) => {
    
    function setStatus(status=200){
        return {
            status: status,
            headers: {
                "content-type": "application/json; charset=utf-8",
                "Access-Control-Allow-Origin": "*", // Allow all origins
                "Access-Control-Allow-Headers": "Content-Type", 
            },
        };
    }

    const url = new URL(req.url);
    const pathname = url.pathname;

    switch (true) {
        case pathname === '/': {
            const homeResponse = { message: "Welcome to homepage. It's todos from jsonplaceholder, but with Deno, on Deno Deploy™. Visit /todos or /todos/1 to /todos/200" };
            return new Response(JSON.stringify(homeResponse), setStatus());
        }
        case pathname === "/status": {
            const statusResponse = { status: "OK" };
            return new Response(JSON.stringify(statusResponse), setStatus());
        }

        case pathname === "/todos":
           return new Response(JSON.stringify(data), setStatus());

        case pathname.startsWith("/todos/"): {
            const id = pathname.split("/")[2];
            if (!/^\d+$/.test(id)) {
                const notFoundResponse = { message: "Invalid ID" };
                return new Response(JSON.stringify(notFoundResponse), setStatus(400));
            }
            const numericId = parseInt(id);
            const item = data.find(todo => todo.id === numericId);

            if (item) {
                return new Response(JSON.stringify(item), setStatus());
            } else {
                const notFoundResponse = { message: "Todo Not Found" };
                return new Response(JSON.stringify(notFoundResponse), setStatus(404));
            }
        }
        default: {
            const pageNotFoundResponse = { message: "Page Not Found" };
            return new Response(JSON.stringify(pageNotFoundResponse), setStatus(404));
        }

    }
});
