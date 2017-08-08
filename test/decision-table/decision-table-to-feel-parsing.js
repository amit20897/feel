var XLSX = require('xlsx');
var chai = require('chai');
var expect = chai.expect;
var DTable = require('../../utils/helper/decision-table');
var fs = require('fs');

var excelWorkbookPath = 'test/data/PostBureauRiskCategory2.xlsx';

describe("Excel reading...(internal stuff)...", function() {
  it('should be that parseXLS() returns an array', function() {

    var csvJson = DTable._.parseXLS(excelWorkbookPath)
    expect(Array.isArray(csvJson)).to.equal(true)
  });

  it('should be that parseCsv() returns an object', function(){
    var csvJson = DTable._.parseXLS(excelWorkbookPath);
    var resultObject = DTable._.parseCsv(csvJson);
    var values = Object.values(resultObject);

    expect(Array.isArray(values)).to.equal(true);

    values.forEach(v => expect(v).to.be.string );
  });

  it('should create the decision object without context property', function(){
    var excelSheetsCsvPartial = DTable._.parseXLS(excelWorkbookPath);
    var excelSheetsJsonCsv = DTable._.parseCsv(excelSheetsCsvPartial);
    var values = Object.values(excelSheetsJsonCsv);
    var dto = DTable.csv_to_decision_table(values[0]);
    expect(dto.context).to.be.undefined;
  });

  it('should create feel context object for decision table correctly', function() {
    var excelSheetsCsvPartial = DTable._.parseXLS(excelWorkbookPath);
    var excelSheetsJsonCsv = DTable._.parseCsv(excelSheetsCsvPartial);
    var values = Object.values(excelSheetsJsonCsv);
    var boxedExpression = fs.readFileSync('test\\data\\BoxedExpression-PostBureauRiskCategoryTable-Compressed.txt', { encoding: 'utf8' });
    // boxedExpression = boxedExpression.replace(/(\r\n|\n|\t)/g, '')
    var dto = DTable.csv_to_decision_table(values[0]);
    // debugger;
    var result = DTable._.makeContext(values[0], dto)
      + '\n'; //adding this to avoid problem with editor
    // console.log({a: boxedExpression, b: result})
    fs.writeFileSync('file1.txt', boxedExpression, { encoding: 'utf8'})
    fs.writeFileSync('file2.txt', result, { encoding: 'utf8'})
    // expect(boxedExpression).to.equal(result)
    expect(boxedExpression.localeCompare(result)).to.equal(0)
  });

  it('should detect if a sheet is a decision table model', function() {
    var excelSheetsCsvPartial = DTable._.parseXLS(excelWorkbookPath);
    var excelSheetsJsonCsv = DTable._.parseCsv(excelSheetsCsvPartial);
    var values = Object.values(excelSheetsJsonCsv);
    var result = DTable._.isDecisionTableModel(values[1])

    expect(result).to.equal(false)

    result = DTable._.isDecisionTableModel(values[0])

    expect(result).to.equal(true)
  })
});

describe('Excel workbook parsing...', function() {

})
