// Assuming your corpus data is imported or defined here
import { NextRequest, NextResponse } from 'next/server';
import { corpusData } from '../../data/corpusData'; // Adjust the import path as necessary

export default function POST(req) {
    const { query } = req.body;
    if (!query) {
        return NextResponse.json({ error: 'Query is required' });
    }

    try {
        const results = searchCorpus(query);
        return NextResponse.json(results)
    } catch(error) {
        console.error(error);
        return NextResponse.json({ 'error': "error occurred while fetching the question" });
    }
}

function searchCorpus(query) {
    let results = [];

    corpusData.forEach(book => {
        book.cantos.forEach(canto => {
            canto.text.forEach((line, index) => {
                if (line.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        book: book.book,
                        canto: canto.number,
                        lineNumber: index + 1,
                        text: line
                    });
                }
            });
        });
    });

    return results;
}
