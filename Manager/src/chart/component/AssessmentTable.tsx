import React from "react";
import TableHeader from "./TableHeader";
import TableCell from "./TableCell";
import type { SearchResult } from "../../Types/Assessment";
import {useChartStore} from "../../zustand/ChartStore.ts";
import {useChartSearchStore} from "../../zustand/ChartSearchQuery.ts";

interface AssessmentTableProps {
    results?: SearchResult[];
}

const AssessmentTable: React.FC<AssessmentTableProps> = ({ results }) => {
    const { setAssessment } = useChartStore();

    const renderHighlightedText = (highlightedText?: string) => {
        if (!highlightedText) return null;

        return (
            <span
                dangerouslySetInnerHTML={{
                    __html: highlightedText.replace(
                        /<em>(.*?)<\/em>/g,
                        '<span class="bg-yellow-200 font-semibold">$1</span>'
                    )
                }}
            />
        );
    };

    if (!results?.length) {
        return (
            <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                <tr>
                    <TableHeader>증상코드</TableHeader>
                    <TableHeader>증상목록코드</TableHeader>
                    <TableHeader>증상분류</TableHeader>
                    <TableHeader>증상명</TableHeader>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                        검색 결과가 없습니다
                    </td>
                </tr>
                </tbody>
            </table>
        );
    }

    return (
        <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
            <tr>
                <TableHeader>증상코드</TableHeader>
                <TableHeader>증상목록코드</TableHeader>
                <TableHeader>증상분류</TableHeader>
                <TableHeader>증상명</TableHeader>
            </tr>
            </thead>
            <tbody>
            {results.map((result, index) => (
                <tr key={index} className="hover:bg-gray-50" onClick={() => setAssessment(result.source.증상목록코드)}>
                    <TableCell className="text-teal-700 font-medium">
                        {result.source.증상코드}
                    </TableCell>
                    <TableCell className="text-teal-700 font-medium">
                        {result.source.증상목록코드}
                    </TableCell>
                    <TableCell>
                        {result.source.증상분류_한글}
                    </TableCell>
                    <TableCell>
                        {renderHighlightedText(result.highlight?.증상명?.[0]) || result.source.증상명}
                    </TableCell>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default AssessmentTable;