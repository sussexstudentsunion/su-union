import React, { useEffect, useState, useCallback } from 'react';
import {
  BoxType,
  InternalArea,
  InternalSlateData,
  Layout,
} from '~types/slates';
import Form from 'react-jsonschema-form';
import { AreasMap, SlateLayout } from '~components/SlateLayout';
import { css, cx } from 'emotion';
import { keyframes } from '@emotion/core';
import Select from 'react-select';
import { enumValues } from '~libs/enumValues';
import produce from 'immer';
import { getAreaBox, slateBoxes } from '~components/Slate/Boxes/boxes';
import { mapValues, keyBy } from 'lodash';
import { FalmerImageSelector } from '~falmer/components/FalmerImageSelector';
import { BoxError } from '~falmer/containers/FalmerFeaturedAreas/BoxError';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { requestImage } from '~falmer/ducks/images';
import { SlateLayoutSelector } from '~falmer/containers/FalmerFeaturedAreas/SlateLayoutSelector';

interface Props {
  data: InternalSlateData;
  onSave: (data: InternalSlateData) => void;
}

const pulsing = keyframes`
  0% {
    background-color: rgba(62,62,62,0.2);
  }
  50% {
    background-color: rgba(62,62,62,0.05);
  }
  100% {
    background-color: rgba(62,62,62,0.2);
  }
`;
const pulsingSelected = keyframes`
  0% {
    box-shadow: 0 0 30px rgba(39,66,140,0.6);
            background-color: rgba(62,62,62,0);


  }
  50% {
    box-shadow: 0 0 60px rgba(39,66,140,0.25);
                background-color: rgba(62,62,62,0.02);

  }
  100% {
    box-shadow: 0 0 30px rgba(39,66,140,0.6);
        background-color: rgba(62,62,62,0);

  }
`;

const editableStyle = css({
  width: '100%',
  height: '100%',
  position: 'relative',
});

const editableStyleOverlay = css({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  animation: `${pulsing} 3s ease infinite`,
  zIndex: 100,
  mixBlendMode: 'multiply',
});
const editableStyleOverlaySelected = css({
  animation: `${pulsingSelected} 3s ease infinite`,
});

const EditableArea: React.FC<{
  area: InternalArea;
  onSelect: () => void;
  selected: boolean;
}> = ({ area, onSelect, selected }) => {
  const dispatch = useDispatch();
  const usedImages: number[] = Object.entries<number>(area[0].data)
    .filter(([key, value]) => key.endsWith('Image') && value !== null)
    .map(([_key, value]) => value);

  const mapState = useCallback(
    (state) => {
      return keyBy(usedImages.map((id) => state.images.images[id]), 'mediaId');
    },
    [area],
  );
  const imageData = useMappedState(mapState);

  const transformed = mapValues(area[0].data, (value, key) => {
    if (key.endsWith('Image')) {
      if (!imageData.hasOwnProperty(value) && value !== null) {
        dispatch(requestImage(value));
      }
      return imageData.hasOwnProperty(value) && imageData[value].loaded === true
        ? imageData[value]
        : {
            resource: 'original_images/7d4f05af37044784b098aa0e72ee7091',
            width: 1042,
            height: 556,
          };
    }

    return value;
  });

  const AreaBox = getAreaBox(area[0].type);

  return (
    <div className={editableStyle}>
      <div
        onClick={onSelect}
        className={cx(editableStyleOverlay, {
          [editableStyleOverlaySelected]: selected,
        })}
      />
      <BoxError>
        <AreaBox {...transformed} />
      </BoxError>
    </div>
  );
};

const boxNameMap = mapValues(slateBoxes, (box) => box.displayName);

function getBoxValue(value: BoxType) {
  return { value, label: boxNameMap[value] };
}

const widgets = {
  FalmerImage: ({ value, onChange }: any) => (
    <FalmerImageSelector value={value} onChange={onChange} />
  ),
};

export const SlateEditor: React.FC<Props> = ({ data, onSave }) => {
  const [selectedArea, updateSelectedArea] = useState<null | number>(null);
  const [editorData, updateEditorData] = useState<InternalSlateData>(data);

  const handleSave = useCallback(() => {
    onSave(editorData);
  }, [editorData]);

  const changeLayout = useCallback((layout: Layout) => {
    const currentData = editorData !== null ? editorData : data;

    updateSelectedArea(0);
    updateEditorData({
      layout,
      areas: new Array(AreasMap[layout]).fill(null).map((_: any, i: number) =>
        currentData.areas[i] !== undefined
          ? currentData.areas[i]
          : [
              {
                type: BoxType.NA,
                data: {},
              },
            ],
      ),
    });
  }, []);

  const changeBox = useCallback((selectedArea: any, box: BoxType) => {
    updateEditorData(
      produce((draft) => {
        draft.areas[selectedArea][0].type = box;
        draft.areas[selectedArea][0].data = {};
      }),
    );
  }, []);

  const updateBox = useCallback((selectedArea: any, res: any) => {
    updateEditorData(
      produce((draft) => {
        draft.areas[selectedArea][0].data = res.formData;
      }),
    );
  }, []);

  useEffect(() => {
    changeLayout(data.layout);
  }, []);

  if (editorData === null) {
    return null;
  }

  return (
    <div className="Layout Layout--sidebar-thin Layout--sidebar-right">
      <div>
        <SlateLayout
          layout={editorData.layout}
          areas={editorData.areas.map((area, i) => (
            <EditableArea
              selected={selectedArea === i}
              area={area}
              key={i}
              onSelect={() => updateSelectedArea(i)}
            />
          ))}
        />
      </div>

      <aside>
        <button className="Button" onClick={handleSave}>
          Save slate
        </button>
        <SlateLayoutSelector
          value={editorData.layout}
          layouts={enumValues(Layout)}
          onChange={(l: Layout) => changeLayout(l)}
        />
        {selectedArea !== null ? (
          <div>
            <Select
              value={getBoxValue(editorData.areas[selectedArea][0].type)}
              onChange={(v: any) => changeBox(selectedArea, v.value)}
              options={Object.values(BoxType).map(getBoxValue)}
              isMulti={false}
            />

            <Form
              schema={slateBoxes[editorData.areas[selectedArea][0].type].schema}
              uiSchema={
                slateBoxes[editorData.areas[selectedArea][0].type].uiSchema
              }
              onChange={(res) => updateBox(selectedArea, res)}
              onSubmit={(x) => console.log('submitted', x)}
              onError={(x) => console.log('err', x)}
              formData={editorData.areas[selectedArea][0].data}
              widgets={widgets}
            />
          </div>
        ) : null}
      </aside>
    </div>
  );
};
