import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select * from hl_unitcheckin_temp
                ORDER BY ID
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? `${recordset[0].EnrollID}_${recordset[recordset.length-1].EnrollID}` : null;


        return { recordset, batchKey  };
    },
    operationSchema: {
        entity: "hl_unit_checkins",
        entityId: "CSP_ID",
        operation: "PATCH",
        fields:{
            "hl_Location@odata.bind": {
                relatedEntity: "hl_housinglocations",
                field: "HousingLocationID"
            },
            "hl_name": "Name",
            "hl_CheckInDate": "CheckinDate",
            "hl_CheckOutDate": "CheckoutDate",
            "hl_unitid@odata.bind": {
                relatedEntity: "hl_housingunits",
                field: "HousingUnitID"
            }
        }
    },
    stageData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_update_unitcheckins]");
    },
    confirmData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_update_unitcheckins_confirm]");
    }
    
}
