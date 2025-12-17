import Card from '../../components/ui/Card';

const PlaceholderChart = ({ title = "Chart Placeholder" }) => {
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
      <div className="h-64 bg-slate-800/50 rounded-xl flex items-center justify-center border border-slate-700 border-dashed">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-slate-400 text-sm">Chart visualization coming soon</p>
        </div>
      </div>
    </Card>
  );
};

export default PlaceholderChart;
