import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getMonthlySummary, getAllUsers, getAllTransactions } from '../../api/walletApi';

export default function AdminDashboard() {
    const [range, setRange] = useState('month');
    const [data, setData] = useState([]);
    const [stats, setStats] = useState({ users: 0, txns: 0, volume: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    useEffect(() => {
        generateGraphData();
    }, [range]);

    const loadStats = async () => {
        try {
            const [users, txns] = await Promise.all([getAllUsers(), getAllTransactions()]);
            const volume = txns.reduce((acc, t) => acc + t.amount, 0);
            setStats({ users: users.length, txns: txns.length, volume });
        } catch (e) {
            console.error(e);
        }
    };

    const generateGraphData = async () => {
        setLoading(true);
        // Mocking granular data based on the requested range
        // In a real app, these would be separate API calls
        let mockData = [];
        const now = new Date();

        if (range === 'day') {
            for (let i = 0; i < 24; i++) {
                mockData.push({ name: `${i}:00`, amount: Math.floor(Math.random() * 5000) });
            }
        } else if (range === 'week') {
            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(day => {
                mockData.push({ name: day, amount: Math.floor(Math.random() * 20000) });
            });
        } else if (range === 'month') {
            for (let i = 1; i <= 30; i += 3) {
                mockData.push({ name: `Day ${i}`, amount: Math.floor(Math.random() * 50000) });
            }
        } else if (range === 'quarter') {
            ['Jan', 'Feb', 'Mar'].forEach(m => {
                mockData.push({ name: m, amount: Math.floor(Math.random() * 150000) });
            });
        }

        setData(mockData);
        setLoading(false);
    };

    return (
        <div className="flex-column" style={{ gap: '20px' }}>
            <div className="grid-2" style={{ gap: '15px' }}>
                <div className="page-card" style={{ margin: 0, padding: '20px', textAlign: 'center' }}>
                    <div className="transaction-date">Total Users</div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)' }}>{stats.users}</div>
                </div>
                <div className="page-card" style={{ margin: 0, padding: '20px', textAlign: 'center' }}>
                    <div className="transaction-date">Transaction Volume</div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--secondary)' }}>₹{stats.volume.toLocaleString()}</div>
                </div>
            </div>

            <div className="page-card" style={{ margin: 0, padding: '20px' }}>
                <div className="flex-between" style={{ marginBottom: '20px' }}>
                    <h3 className="section-title" style={{ margin: 0 }}>Analytics</h3>
                    <select value={range} onChange={(e) => setRange(e.target.value)} className="btn-outline" style={{ color: 'var(--text)', padding: '5px 10px' }}>
                        <option value="day">Day</option>
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                        <option value="quarter">Quarter</option>
                    </select>
                </div>

                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                            <Tooltip contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                            <Area type="monotone" dataKey="amount" stroke="var(--primary)" fillOpacity={1} fill="url(#colorAmt)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
