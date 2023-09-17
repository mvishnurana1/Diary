import { render, screen } from "@testing-library/react";
import PerformanceChart from "../../../src/components/ActivityChart/ActivityChart.tsx";

// To fix the warning from the ActivityChart Component
jest.mock('react-chartjs-2', () => ({
    ...jest.requireActual('react-chartjs-2'),
    Line: jest.fn(() => <div>LINE</div>),
}));

jest.mock('react-chartjs-2', () => ({
    ...jest.requireActual('react-chartjs-2'),
    Line: jest.fn(() => <div>LINE</div>),
}));

describe("PerformanceChart Component:", () => {
    test("Displays the header h1 with text 'Activity'", async () => {
        render(<PerformanceChart />);
        const header = await screen.findByText("Activity");

        expect(header.innerHTML).toBe("Activity");
    });

    test("Displays the header h2 with text 'this month'", async () => {
        render(<PerformanceChart />);
        const subHeader = await screen.findByText("this month");

        expect(subHeader.innerHTML).toBe("this month");
    });
});
