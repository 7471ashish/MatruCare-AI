import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Terminal } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <Card className="max-w-md w-full p-8 text-center border-dashed border-2 border-white/20">
        <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-3xl bg-brand-500/10 border border-brand-500/30 text-brand-400 shadow-neon">
          <Terminal className="w-10 h-10" />
        </div>

        <h1 className="text-5xl font-extrabold font-mono text-white mb-2">
          404
        </h1>
        <h2 className="text-lg font-bold font-mono text-cyan-400 mb-3 uppercase tracking-wider">
          ENDPOINT_NOT_FOUND
        </h2>
        <p className="text-xs font-mono text-gray-400 mb-8 leading-relaxed">
          The route you are navigating to does not exist in the hackathon directory. Return to the main portal.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="w-full sm:w-auto">
            <Button size="md" variant="primary" icon={Home} className="w-full shadow-neon">
              Return Home
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <Button size="md" variant="outline" icon={ArrowLeft} className="w-full">
              Go Back
            </Button>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
