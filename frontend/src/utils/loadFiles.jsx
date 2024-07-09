import Papa from 'papaparse';

// Fetch CSV data from a given file name
const fetchCSV = async (fileName) => {
    const response = await fetch(fileName);
    const data = await response.text();
    return data;
};

// Load multiple CSV files containing questions into a combined array
const loadFiles = async () => {
    const files = [
        { fileName: '/questions/list1.csv', category: 1 },
        { fileName: '/questions/list2.csv', category: 2 },
        { fileName: '/questions/list3.csv', category: 3 },
        { fileName: '/questions/list4.csv', category: 4 },
        { fileName: '/questions/list5.csv', category: 5 },
    ];

    try {
        const results = await Promise.all(files.map(file => fetchCSV(file.fileName)));

        const combinedQuestions = results.reduce((acc, data, index) => {
            const parsed = Papa.parse(data, { header: true });
            parsed.data.forEach((row, rowIndex) => {
                const id = acc.length + 1;
                const name = row.question;
                const correctAnswer = row.correct;
                const options = [row.option1, row.option2, row.option3];

                acc.push({ id, name, category: files[index].category, correctAnswer, options });
            });
            return acc;
        }, []);

        return combinedQuestions; // Return array of combined questions
    } catch (error) {
        console.error('Error loading CSV files:', error);
        return []; // Return empty array on error
    }
};

export default loadFiles;
