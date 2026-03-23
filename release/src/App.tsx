import { useState, useCallback } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Train, Truck, Plus, Download, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import type { TransportMode, RailwayRecord, TruckRecord, Record } from '@/types';

function App() {
  const [mode, setMode] = useState<TransportMode>('railway');
  const [records, setRecords] = useState<Record[]>([]);
  
  // Railway form state
  const [railwayForm, setRailwayForm] = useState({
    carNumber: '',
    trailerNumber: '',
    name: '',
    certificateNumber: '',
    phone: '',
    boxNumber: '',
    boxType: '',
    destination: '',
    productName: '',
  });
  
  // Truck form state
  const [truckForm, setTruckForm] = useState({
    carNumber: '',
    trailerNumber: '',
    name: '',
    certificateNumber: '',
    phone: '',
    carType: '',
    destination: '',
    productName: '',
    departureTime: '',
    estimatedArrivalTime: '',
  });

  const handleRailwayInputChange = useCallback((field: string, value: string) => {
    setRailwayForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleTruckInputChange = useCallback((field: string, value: string) => {
    setTruckForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const addRailwayRecord = useCallback(() => {
    if (!railwayForm.carNumber.trim()) {
      toast.error('请输入车号');
      return;
    }
    
    const newRecord: RailwayRecord = {
      id: Date.now().toString(),
      mode: 'railway',
      ...railwayForm,
    };
    
    setRecords(prev => [...prev, newRecord]);
    setRailwayForm({
      carNumber: '',
      trailerNumber: '',
      name: '',
      certificateNumber: '',
      phone: '',
      boxNumber: '',
      boxType: '',
      destination: '',
      productName: '',
    });
    toast.success('铁路记录添加成功');
  }, [railwayForm]);

  const addTruckRecord = useCallback(() => {
    if (!truckForm.carNumber.trim()) {
      toast.error('请输入车号');
      return;
    }
    
    const newRecord: TruckRecord = {
      id: Date.now().toString(),
      mode: 'truck',
      ...truckForm,
    };
    
    setRecords(prev => [...prev, newRecord]);
    setTruckForm({
      carNumber: '',
      trailerNumber: '',
      name: '',
      certificateNumber: '',
      phone: '',
      carType: '',
      destination: '',
      productName: '',
      departureTime: '',
      estimatedArrivalTime: '',
    });
    toast.success('汽运记录添加成功');
  }, [truckForm]);

  const deleteRecord = useCallback((id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    toast.success('记录已删除');
  }, []);

  const exportToTxt = useCallback(() => {
    if (records.length === 0) {
      toast.error('没有可导出的记录');
      return;
    }

    let content = '';
    
    records.forEach((record, index) => {
      if (record.mode === 'railway') {
        content += `铁路\n`;
        content += `车号：${record.carNumber}\n`;
        content += `挂车：${record.trailerNumber}\n`;
        content += `姓名：${record.name}\n`;
        content += `证号：${record.certificateNumber}\n`;
        content += `电话：${record.phone}\n`;
        content += `箱号：${record.boxNumber}\n`;
        content += `箱型：${record.boxType}\n`;
        content += `到站：${record.destination}\n`;
        content += `品名：${record.productName}\n`;
      } else {
        content += `汽运\n`;
        content += `车号：${record.carNumber}\n`;
        content += `挂号：${record.trailerNumber}\n`;
        content += `姓名：${record.name}\n`;
        content += `证号：${record.certificateNumber}\n`;
        content += `电话：${record.phone}\n`;
        content += `车型：${record.carType}\n`;
        content += `到站：${record.destination}\n`;
        content += `品名：${record.productName}\n`;
        content += `发车时间：${record.departureTime}\n`;
        content += `预计到达时间：${record.estimatedArrivalTime}\n`;
      }
      
      if (index < records.length - 1) {
        content += '\n';
      }
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `运输记录_${new Date().toLocaleDateString()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('导出成功');
  }, [records]);

  const clearAll = useCallback(() => {
    if (records.length === 0) return;
    
    if (confirm('确定要清空所有记录吗？')) {
      setRecords([]);
      toast.success('已清空所有记录');
    }
  }, [records]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            运输信息录入系统
          </h1>
          <p className="text-gray-500">铁路与汽运信息便捷录入与导出</p>
        </div>

        {/* Mode Switch */}
        <Tabs value={mode} onValueChange={(v) => setMode(v as TransportMode)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="railway" className="flex items-center gap-2">
              <Train className="w-4 h-4" />
              铁路运输
            </TabsTrigger>
            <TabsTrigger value="truck" className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              汽运运输
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              {mode === 'railway' ? (
                <><Train className="w-5 h-5 text-blue-600" /> 铁路信息录入</>
              ) : (
                <><Truck className="w-5 h-5 text-green-600" /> 汽运信息录入</>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mode === 'railway' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="r-carNumber">车号</Label>
                  <Input
                    id="r-carNumber"
                    placeholder="请输入车号"
                    value={railwayForm.carNumber}
                    onChange={(e) => handleRailwayInputChange('carNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="r-trailerNumber">挂车</Label>
                  <Input
                    id="r-trailerNumber"
                    placeholder="请输入挂车号"
                    value={railwayForm.trailerNumber}
                    onChange={(e) => handleRailwayInputChange('trailerNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="r-name">姓名</Label>
                  <Input
                    id="r-name"
                    placeholder="请输入姓名"
                    value={railwayForm.name}
                    onChange={(e) => handleRailwayInputChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="r-certificateNumber">证号</Label>
                  <Input
                    id="r-certificateNumber"
                    placeholder="请输入证号"
                    value={railwayForm.certificateNumber}
                    onChange={(e) => handleRailwayInputChange('certificateNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="r-phone">电话</Label>
                  <Input
                    id="r-phone"
                    placeholder="请输入电话"
                    value={railwayForm.phone}
                    onChange={(e) => handleRailwayInputChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="r-boxNumber">箱号</Label>
                  <Input
                    id="r-boxNumber"
                    placeholder="请输入箱号"
                    value={railwayForm.boxNumber}
                    onChange={(e) => handleRailwayInputChange('boxNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="r-boxType">箱型</Label>
                  <Input
                    id="r-boxType"
                    placeholder="请输入箱型"
                    value={railwayForm.boxType}
                    onChange={(e) => handleRailwayInputChange('boxType', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="r-destination">到站</Label>
                  <Input
                    id="r-destination"
                    placeholder="请输入到站"
                    value={railwayForm.destination}
                    onChange={(e) => handleRailwayInputChange('destination', e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="r-productName">品名</Label>
                  <Input
                    id="r-productName"
                    placeholder="请输入品名"
                    value={railwayForm.productName}
                    onChange={(e) => handleRailwayInputChange('productName', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Button 
                    onClick={addRailwayRecord} 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    添加铁路记录
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="t-carNumber">车号</Label>
                  <Input
                    id="t-carNumber"
                    placeholder="请输入车号"
                    value={truckForm.carNumber}
                    onChange={(e) => handleTruckInputChange('carNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="t-trailerNumber">挂号</Label>
                  <Input
                    id="t-trailerNumber"
                    placeholder="请输入挂号号"
                    value={truckForm.trailerNumber}
                    onChange={(e) => handleTruckInputChange('trailerNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="t-name">姓名</Label>
                  <Input
                    id="t-name"
                    placeholder="请输入姓名"
                    value={truckForm.name}
                    onChange={(e) => handleTruckInputChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="t-certificateNumber">证号</Label>
                  <Input
                    id="t-certificateNumber"
                    placeholder="请输入证号"
                    value={truckForm.certificateNumber}
                    onChange={(e) => handleTruckInputChange('certificateNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="t-phone">电话</Label>
                  <Input
                    id="t-phone"
                    placeholder="请输入电话"
                    value={truckForm.phone}
                    onChange={(e) => handleTruckInputChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="t-carType">车型</Label>
                  <Input
                    id="t-carType"
                    placeholder="请输入车型"
                    value={truckForm.carType}
                    onChange={(e) => handleTruckInputChange('carType', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="t-destination">到站</Label>
                  <Input
                    id="t-destination"
                    placeholder="请输入到站"
                    value={truckForm.destination}
                    onChange={(e) => handleTruckInputChange('destination', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="t-productName">品名</Label>
                  <Input
                    id="t-productName"
                    placeholder="请输入品名"
                    value={truckForm.productName}
                    onChange={(e) => handleTruckInputChange('productName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="t-departureTime">发车时间</Label>
                  <Input
                    id="t-departureTime"
                    placeholder="请输入发车时间"
                    value={truckForm.departureTime}
                    onChange={(e) => handleTruckInputChange('departureTime', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="t-estimatedArrivalTime">预计到达时间</Label>
                  <Input
                    id="t-estimatedArrivalTime"
                    placeholder="请输入预计到达时间"
                    value={truckForm.estimatedArrivalTime}
                    onChange={(e) => handleTruckInputChange('estimatedArrivalTime', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Button 
                    onClick={addTruckRecord} 
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    添加汽运记录
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Records List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              记录列表 ({records.length}条)
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                disabled={records.length === 0}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                清空
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={exportToTxt}
                disabled={records.length === 0}
              >
                <Download className="w-4 h-4 mr-1" />
                导出TXT
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {records.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>暂无记录，请添加</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {records.map((record) => (
                    <div
                      key={record.id}
                      className={`p-4 rounded-lg border ${
                        record.mode === 'railway'
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-green-50 border-green-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2 mb-2">
                            {record.mode === 'railway' ? (
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                                铁路
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                                汽运
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            <p><span className="text-gray-500">车号：</span>{record.carNumber || '-'}</p>
                            <p><span className="text-gray-500">{record.mode === 'railway' ? '挂车' : '挂号'}：</span>{record.trailerNumber || '-'}</p>
                            <p><span className="text-gray-500">姓名：</span>{record.name || '-'}</p>
                            <p><span className="text-gray-500">证号：</span>{record.certificateNumber || '-'}</p>
                            <p><span className="text-gray-500">电话：</span>{record.phone || '-'}</p>
                            {record.mode === 'railway' ? (
                              <>
                                <p><span className="text-gray-500">箱号：</span>{(record as RailwayRecord).boxNumber || '-'}</p>
                                <p><span className="text-gray-500">箱型：</span>{(record as RailwayRecord).boxType || '-'}</p>
                                <p><span className="text-gray-500">到站：</span>{(record as RailwayRecord).destination || '-'}</p>
                                <p className="col-span-2"><span className="text-gray-500">品名：</span>{(record as RailwayRecord).productName || '-'}</p>
                              </>
                            ) : (
                              <>
                                <p><span className="text-gray-500">车型：</span>{(record as TruckRecord).carType || '-'}</p>
                                <p><span className="text-gray-500">到站：</span>{(record as TruckRecord).destination || '-'}</p>
                                <p><span className="text-gray-500">品名：</span>{(record as TruckRecord).productName || '-'}</p>
                                <p><span className="text-gray-500">发车时间：</span>{(record as TruckRecord).departureTime || '-'}</p>
                                <p><span className="text-gray-500">预计到达时间：</span>{(record as TruckRecord).estimatedArrivalTime || '-'}</p>
                              </>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteRecord(record.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
