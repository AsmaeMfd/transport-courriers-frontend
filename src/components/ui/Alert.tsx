import { ReactNode } from 'react';

interface AlertProps {
    type: 'error' | 'success' | 'warning' | 'info';
    children: ReactNode;
}

const Alert = ({ type, children }: AlertProps) => {
    const styles = {
        error: 'bg-red-50 text-red-800',
        success: 'bg-green-50 text-green-800',
        warning: 'bg-yellow-50 text-yellow-800',
        info: 'bg-blue-50 text-blue-800'
    };

    return (
        <div className={`rounded-md p-4 ${styles[type]}`}>
            <div className="flex">
                <div className="ml-3">
                    <p className="text-sm font-medium">{children}</p>
                </div>
            </div>
        </div>
    );
};

export default Alert; 