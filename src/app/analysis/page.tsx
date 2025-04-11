"use client";

import React from 'react';

const AnalysisPage = () => {
    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Counter Analysis</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Enemy Team Section */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Enemy Team</h2>
                        <div className="grid grid-cols-5 gap-2">
                            {Array(5).fill(null).map((_, index) => (
                                <div
                                    key={`enemy-${index}`}
                                    className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors"
                                >
                                    <span className="text-gray-400">+</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Your Team Section */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Your Team</h2>
                        <div className="grid grid-cols-5 gap-2">
                            {Array(5).fill(null).map((_, index) => (
                                <div
                                    key={`ally-${index}`}
                                    className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors"
                                >
                                    <span className="text-gray-400">+</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Counter Suggestions Section */}
                    <div className="md:col-span-2 bg-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Recommended Picks</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                            {/* Counter suggestions will be displayed here */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisPage; 