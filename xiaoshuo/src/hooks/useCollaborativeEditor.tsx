import { useEffect, useState } from "react";
import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';

const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
};

const useCollaborativeEditor = (documentTitle: string, user: any) => {
    const [provider, setProvider] = useState();
    const [ydoc, setYdoc] = useState<Y.Doc>();

    useEffect(() => {
        const ydoc = new Y.Doc();
        const token = getCookie('token');

        const provider = new HocuspocusProvider({
            url: process.env.REACT_APP_WS_URL || 'ws://localhost:3000', // 指向你的服务器
            name: documentTitle,
            document: ydoc,
            token, // 传递给 onAuthenticate
        });

        setYdoc(ydoc);
        setProvider(provider);

        return () => {
            provider.destroy();
            ydoc.destroy();
        };
    }, [documentTitle]);

    return { ydoc, provider };
}

export default useCollaborativeEditor;