import DataTable, { defaultThemes } from 'react-data-table-component';
import './css/index.css';

const customStyles = {
    header: {
        style: {
            fontWeight: '1000',
            fontSize: '40px',
            fontFamily: 'Ubuntu',
            color: 'rgb(250, 250, 250)',//'rgb(13, 71, 113)',
            backgroundColor: 'rgb(13, 71, 113)',//'rgb(250, 250, 250)',
        }
    },
    headCells: {
        style: {
            fontWeight: 'bold',
            fontSize: '15px',
            color: 'rgb(13, 71, 113)',
            borderRightStyle: 'solid',
            borderRightWidth: '1px',
            borderRightColor: defaultThemes.default.divider.default,
            backgroundColor: 'rgb(240, 240, 240)',
        },
    },
    cells: {
        style: {
            '&:not(:last-of-type)': {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: defaultThemes.default.divider.default,
            },
            fontSize: '15px',
            // padding: '2px'
        },
    },
};

const Table = (props) => {
    console.log("NAME", props.name);
    console.log("TABLE", props.table)
    const hiddenColumns = new Set(["date_value", "elapsed_time", "id", "seconds", "pace"]);
    const buildColumns = () => {
        let columns = [];
        for (const column_name of Object.keys(props.table[0])) {
            if (hiddenColumns.has(column_name)) {
                continue;
            }
            columns.push({
                name: column_name,
                selector: row => row[column_name],
                sortable: true,
            });
        }
        return columns;
    }
    return (
        <div style={{fontFamily: "Ubuntu"}}>
            <DataTable
                title={props.name}
                columns={buildColumns()}
                data={props.table}
                highlightOnHover
                striped
                customStyles={customStyles}
                dense
            />
        </div>
    );
};

export default Table;