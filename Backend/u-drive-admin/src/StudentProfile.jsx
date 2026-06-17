export const StudentProfile = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const email = localStorage.getItem("studentEmail");
        fetch(`http://localhost:5000/api/my-progress?email=${email}`)
            .then(res => res.json())
            .then(setData);
    }, []);

    if (!data) return <div>Loading your progress...</div>;

    return (
        <div className="p-8 bg-slate-900 rounded-2xl">
            <h2 className="text-white text-2xl font-bold">My Progress</h2>
            
            {/* Theory Progress Bar */}
            <div className="mt-6">
                <div className="flex justify-between text-sm text-slate-400">
                    <span>Theory Training</span>
                    <span>{data.theoryCompleted} / {data.totalTheoryHours} Hours</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-2">
                    <div 
                        className="bg-amber-500 h-2 rounded-full" 
                        style={{ width: `${(data.theoryCompleted / data.totalTheoryHours) * 100}%` }}
                    />
                </div>
            </div>

            {/* Practical Progress Bar */}
            <div className="mt-6">
                <div className="flex justify-between text-sm text-slate-400">
                    <span>Practical Road Training</span>
                    <span>{data.practicalCompleted} / {data.totalPracticalHours} Hours</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-2">
                    <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(data.practicalCompleted / data.totalPracticalHours) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};