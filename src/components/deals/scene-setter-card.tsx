import type { SceneSetterId } from "@/constants/scene-setters";
import { SCENE_SETTERS } from "@/constants/scene-setters";
import { Card, CardContent } from "@/components/data-display/card";

type SceneSetterCardProps = {
  scene: SceneSetterId;
};

export function SceneSetterCard({ scene }: SceneSetterCardProps) {
  const copy = SCENE_SETTERS[scene];

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-5">
        <p className="text-sm font-semibold text-primary">{copy.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {copy.body}
        </p>
      </CardContent>
    </Card>
  );
}
